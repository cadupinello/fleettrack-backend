import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: Pick<User, "id" | "email" | "role">;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Acesso negado! Token não encontrado",
    });
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
      sub: string;
      email: string;
      role: Role;
    };

    (req as AuthRequest).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        message: "Acesso negado! Token inválido",
      });
    }
  }
};
