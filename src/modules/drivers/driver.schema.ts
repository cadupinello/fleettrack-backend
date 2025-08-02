import { DriverStatus, VehicleStatus, VehicleType } from '@prisma/client';
import z from "zod";

const vehicleSchema = z.object({
  plate: z.string()
    .regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, 'Placa inválida (formato: ABC1D23 ou ABC1234)')
    .transform(val => val.toUpperCase()),
  model: z.string().min(2, 'Mínimo 2 caracteres'),
  year: z.number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  type: z.nativeEnum(VehicleType),
  status: z.nativeEnum(VehicleStatus).optional()
}).strict();

export const driverSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX'),
  licenseNumber: z.string().min(5),
  licenseType: z.string().length(1, 'Categoria deve ter 1 caractere'),
  licenseExpiry: z.coerce.date()
    .min(new Date(), 'Deve ser data futura'),
  status: z.nativeEnum(DriverStatus).optional(),
  vehicles: z.array(vehicleSchema).optional()
}).strict();

export const createDriverSchema = driverSchema.extend({
  userId: z.string().uuid()
});

export const updateDriverSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').optional(),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX')
    .optional(),
  licenseNumber: z.string().min(5).optional(),
  licenseType: z.string().length(1, 'Categoria deve ter 1 caractere').optional(),
  licenseExpiry: z.union([
    z.coerce.date()
      .min(new Date(), 'Deve ser data futura')
      .refine(val => !isNaN(val.getTime()), 'Data inválida'),
    z.string().refine(val => !isNaN(new Date(val).getTime()), 'Data inválida')
  ]).optional(),
  status: z.nativeEnum(DriverStatus).optional(),
  vehicles: z.array(vehicleSchema.partial()).optional()
}).strict();

export type DriverInput = z.infer<typeof driverSchema>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;