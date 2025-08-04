import { DriverStatus, Prisma, PrismaClient } from "@prisma/client";
import { CreateDriverInput, UpdateDriverInput } from "./driver.schema";

const prisma = new PrismaClient();

export const driverService = {
  create: async (data: CreateDriverInput) => {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.driver.findFirst({
        where: {
          OR: [{ phone: data.phone }],
        },
      });

      if (existing) {
        throw new Prisma.PrismaClientKnownRequestError(
          existing.phone === data.phone
            ? "Phone already in use"
            : "License number already in use",
          { code: "P2002", clientVersion: "4.0" }
        );
      }

      const driverData: Prisma.DriverCreateInput = {
        name: data.name,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        licenseExpiry: data.licenseExpiry,
        status: data.status || "ACTIVE",
        user: { connect: { id: data.userId } },
        vehicles: data.vehicles
          ? {
              create: data.vehicles.map((v) => ({
                plate: v.plate,
                model: v.model,
                year: v.year,
                type: v.type,
                status: v.status || "AVAILABLE",
              })),
            }
          : undefined,
      };

      return tx.driver.create({
        data: driverData,
        include: { vehicles: true },
      });
    });
  },

  findAll: async (filters?: {
    name?: string;
    phone?: string;
    licenseNumber?: string;
    status?: DriverStatus;
    page?: number;
    limit?: number;
  }) => {
    const {
      name,
      phone,
      licenseNumber,
      status,
      page = 1,
      limit = 10,
    } = filters || {};

    console.log(filters);

    const filtersList: Prisma.DriverWhereInput[] = [];

    if (status) filtersList.push({ status });
    if (name)
      filtersList.push({ name: { contains: name, mode: "insensitive" } });
    if (phone)
      filtersList.push({ phone: { contains: phone, mode: "insensitive" } });
    if (licenseNumber)
      filtersList.push({
        licenseNumber: { contains: licenseNumber, mode: "insensitive" },
      });

    const whereClause: Prisma.DriverWhereInput = filtersList.length
      ? { AND: filtersList }
      : {};

    const [drivers, totalCount] = await Promise.all([
      prisma.driver.findMany({
        where: whereClause,
        include: {
          vehicles: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.driver.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: drivers,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  },

  findById: async (id: string) => {
    return prisma.driver.findUnique({
      where: { id },
      include: {
        vehicles: { orderBy: { year: "desc" } },
        user: { select: { name: true, role: true } },
      },
    });
  },

  update: async (id: string, data: UpdateDriverInput) => {
    return prisma.$transaction(async (tx) => {
      const existingDriver = await tx.driver.findUnique({
        where: { id },
        include: { vehicles: true },
      });

      if (!existingDriver) {
        throw new Prisma.PrismaClientKnownRequestError("Driver not found", {
          code: "P2025",
          clientVersion: "4.0",
        });
      }

      const updateData: Prisma.DriverUpdateInput = {
        ...data,
        name: data.name || existingDriver.name,
        phone: data.phone || existingDriver.phone,
        licenseNumber: data.licenseNumber || existingDriver.licenseNumber,
        licenseType: data.licenseType || existingDriver.licenseType,
        licenseExpiry: data.licenseExpiry || existingDriver.licenseExpiry,
        status: data.status || existingDriver.status,
        vehicles: {
          update: data?.vehicles?.map((vehicle) => ({
            where: { plate: vehicle.plate },
            data: vehicle,
          })),
        },
      };

      if (data.phone || data.licenseNumber) {
        const conflict = await tx.driver.findFirst({
          where: {
            NOT: { id },
            OR: [
              ...(data.phone ? [{ phone: data.phone }] : []),
              ...(data.licenseNumber
                ? [{ licenseNumber: data.licenseNumber }]
                : []),
            ],
          },
        });

        if (conflict) {
          throw new Error(
            conflict.phone === data.phone
              ? "Telefone já está em uso"
              : "Número de licença já está em uso"
          );
        }
      }

      if (data.vehicles) {
        const vehicles = data.vehicles.map((vehicle) => {
          if (
            !vehicle.plate ||
            !vehicle.model ||
            !vehicle.year ||
            !vehicle.type
          ) {
            throw new Error("Dados do veículo inválidos");
          }
          return {
            plate: vehicle.plate,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            status: vehicle.status || "AVAILABLE",
          };
        });
        updateData.vehicles = {
          deleteMany: {},
          create: vehicles,
        };
      } else {
        delete updateData.vehicles;
      }

      return tx.driver.update({
        where: { id },
        data: updateData,
        include: { vehicles: true },
      });
    });
  },

  delete: async (id: string) => {
    return prisma.$transaction(async (tx) => {
      await tx.vehicle.updateMany({
        where: { driverId: id },
        data: { driverId: null },
      });

      return tx.driver.delete({ where: { id } });
    });
  },
};
