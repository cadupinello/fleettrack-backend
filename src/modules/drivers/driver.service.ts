import {
  DriverStatus,
  Prisma,
  PrismaClient,
  VehicleStatus,
  VehicleType,
} from "@prisma/client";
import dayjs from "dayjs";
import { CreateDriverInput, UpdateDriverInput } from "./driver.schema";

const prisma = new PrismaClient();

export const driverService = {
  create: async (data: CreateDriverInput) => {
    console.log("DATA", data);
    return prisma.$transaction(async (tx) => {
      const conflict = await tx.driver.findFirst({
        where: {
          OR: [{ phone: data.phone }, { licenseNumber: data.licenseNumber }],
        },
      });

      if (conflict) {
        throw new Error(
          conflict.phone === data.phone
            ? "Telefone já está em uso"
            : "Número da CNH já está em uso"
        );
      }

      const driver = await tx.driver.create({
        data: {
          name: data.name,
          phone: data.phone ? data.phone.replace(/\D+/g, "") : data.phone,
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType,
          licenseExpiry: data.licenseExpiry
            ? dayjs(data.licenseExpiry).toDate()
            : data.licenseExpiry,
          status: data.status || DriverStatus.ACTIVE,
          user: { connect: { id: data.userId } },
          vehicles: data.vehicles
            ? {
                create: data.vehicles.map((vehicle) => ({
                  ...vehicle,
                  status: vehicle.status || "AVAILABLE",
                })),
              }
            : undefined,
        },
        include: { vehicles: true },
      });

      return driver;
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

    const formmatedPhone = phone?.replace(/\D+/g, "");

    const where: Prisma.DriverWhereInput = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(phone && {
        phone: { contains: formmatedPhone, mode: "insensitive" },
      }),
      ...(licenseNumber && {
        licenseNumber: { contains: licenseNumber, mode: "insensitive" },
      }),
      ...(status && { status }),
    };

    const [data, totalCount] = await Promise.all([
      prisma.driver.findMany({
        where,
        include: {
          vehicles: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.driver.count({ where }),
    ]);

    return {
      data,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
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
      const driver = await tx.driver.findUnique({
        where: { id },
        include: { vehicles: true },
      });

      if (!driver) {
        throw new Error("Motorista não encontrado");
      }

      // Verifica conflitos com outros motoristas
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
              : "Número da CNH já está em uso"
          );
        }
      }

      console.log("Data de expiração ->>>>>>>>>>>>>>>>>", data.licenseExpiry);
      // Criação do objeto de update
      const updateData: Prisma.DriverUpdateInput = {
        name: data.name,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        licenseExpiry: data.licenseExpiry
          ? dayjs(data.licenseExpiry).toDate()
          : data.licenseExpiry,
        status: data.status,
      };

      // Se veículos foram enviados, recria todos
      if (data.vehicles) {
        const validVehicles = data.vehicles.filter(
          (v) => v.plate && v.model && v.year && v.type
        ) as {
          plate: string;
          model: string;
          year: number;
          type: VehicleType;
          status?: VehicleStatus;
        }[];

        updateData.vehicles = {
          deleteMany: {}, // remove todos os antigos
          create: validVehicles.map((v) => ({
            plate: v.plate,
            model: v.model,
            year: v.year,
            type: v.type,
            status: v.status || "AVAILABLE",
          })),
        };
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
