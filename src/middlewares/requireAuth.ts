import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: Pick<User, "id" | "name" | "email" | "role">;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['refresh-token'];

  console.log("TOKEN COOKIE", token);

  if (!token) {
    return res.status(401).json({
      message: "Acesso negado! Token não encontrado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      name: string;
      email: string;
      role: Role;
    };

    (req as AuthRequest).user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Acesso negado! Token inválido",
    });
  }
};
