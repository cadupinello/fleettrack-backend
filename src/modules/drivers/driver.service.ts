
import { PrismaClient } from "@prisma/client";
import { driverSchema } from "./driver.schema";

const prisma = new PrismaClient();

export const driverService = {
  create: async (data: any) => {
    const parsedData = driverSchema.parse(data);
    return prisma.driver.create({ data: parsedData });
  },

  findAll: async () => {
    return prisma.driver.findMany();
  },

  findById: async (id: string) => {
    return prisma.driver.findUnique({ where: { id } });
  },

  update: async (id: string, data: any) => {
    const parsedData = driverSchema.parse(data);
    return prisma.driver.update({ where: { id }, data: parsedData });
  },

  delete: async (id: string) => {
    return prisma.driver.delete({ where: { id } });
  },
}