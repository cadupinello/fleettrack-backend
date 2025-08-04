import { DriverStatus, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CreateDriverInput } from "./driver.schema";
import { driverService } from "./driver.service";

export const driverController = {
  create: async (req: Request, res: Response) => {
    try {
      const token = req.cookies["refresh-token"];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
      };

      const input: CreateDriverInput = {
        ...req.body,
        userId: decoded.sub,
      };

      const driver = await driverService.create(input);
      res.status(201).json(driver);
    } catch (error) {
      handleDriverError(res, error);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const {
        status,
        name,
        phone,
        licenseNumber,
        page = "1",
        limit = "10",
      } = req.query;

      const filters = {
        status: status as DriverStatus,
        name: name as string,
        phone: phone as string,
        licenseNumber: licenseNumber as string,
        page: Number(page),
        limit: Number(limit),
      };

      const drivers = await driverService.findAll(filters);
      return res.status(200).json(drivers);
    } catch (error) {
      handleDriverError(res, error);
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const driver = await driverService.findById(req.params.id as string);
      if (!driver)
        return res.status(404).json({ message: "Motorista não encontrado" });
      res.status(200).json(driver);
    } catch (error) {
      handleDriverError(res, error);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const driver = await driverService.update(
        req.params.id as string,
        req.body
      );
      res.status(200).json(driver);
    } catch (error) {
      handleDriverError(res, error);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await driverService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      handleDriverError(res, error);
    }
  },
};

function handleDriverError(res: Response, error: unknown) {
  console.error("Driver error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target as string[];
      return res.status(409).json({
        type: "CONFLICT_ERROR",
        message: target?.includes("phone")
          ? "Telefone já cadastrado"
          : "Número de licença já cadastrado",
        field: target?.[0],
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        type: "NOT_FOUND",
        message: "Registro não encontrado",
      });
    }
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      type: "AUTH_ERROR",
      message: "Token inválido ou expirado",
    });
  }

  if (error instanceof Error && error.message.includes("already in use")) {
    return res.status(409).json({
      type: "CONFLICT_ERROR",
      message: error.message,
    });
  }

  res.status(500).json({
    type: "INTERNAL_ERROR",
    message: "Erro interno no servidor",
  });
}
