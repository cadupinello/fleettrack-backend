import { DriverStatus, VehicleStatus, VehicleType } from "@prisma/client";
import dayjs from "dayjs";
import z from "zod";

const vehicleSchema = z.object({
  plate: z
    .string()
    .regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, "Placa inválida")
    .transform((val) => val.toUpperCase()),
  model: z.string().min(2, "Mínimo 2 caracteres"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  type: z.nativeEnum(VehicleType),
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const driverSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX"),
  licenseNumber: z.string().min(5),
  licenseType: z.string().length(1, "Categoria deve ter 1 caractere"),
  licenseExpiry: z
    .string()
    .refine((val) => dayjs(val, "YYYY-MM-DD", true).isValid(), {
      message: "Data inválida (use formato YYYY-MM-DD)",
    })
    .transform((val) => dayjs(val).startOf("day").toDate())
    .refine((date) => dayjs(date).isAfter(dayjs()), {
      message: "A data deve ser futura",
    }),
  status: z.nativeEnum(DriverStatus).optional(),
  vehicles: z.array(vehicleSchema).optional(),
});

export const createDriverSchema = driverSchema.extend({
  userId: z.string().uuid(),
});

export const updateDriverSchema = z
  .object({
    name: z.string().min(2).optional(),
    phone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/)
      .optional(),
    licenseNumber: z.string().min(5).optional(),
    licenseType: z.string().length(1).optional(),
    licenseExpiry: z
      .union([
        z.coerce
          .date()
          .refine(
            (val) => !isNaN(val.getTime()) && val > new Date(),
            "Data inválida"
          ),
        z
          .string()
          .refine((val) => !isNaN(new Date(val).getTime()), "Data inválida"),
      ])
      .optional(),
    status: z.nativeEnum(DriverStatus).optional(),
    vehicles: z.array(vehicleSchema.partial()).optional(),
  })
  .strict();

export type DriverInput = z.infer<typeof driverSchema>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
