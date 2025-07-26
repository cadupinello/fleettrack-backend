import { AuthRequest } from "@/middlewares/requireAuth";
import { NextFunction, RequestHandler, Response } from "express";

export function asyncHandler(
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;

  if (user?.role !== "ADMIN") {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  next();
};
