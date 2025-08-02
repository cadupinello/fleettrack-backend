import z from "zod";

import { DriverStatus } from '@prisma/client';

export const publicDriverSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  licenseNumber: z.string(),
  licenseType: z.string(),
  licenseExpiry: z.coerce.date(),
})

export const driverSchema = publicDriverSchema.extend({
  userId: z.string()
})

export const updateDriverSchema = driverSchema.partial();

export const driverStatusSchema = z.nativeEnum(DriverStatus);