import { generateToken, verifyToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await registerUser(body);

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = loginSchema.parse(req.body);
    const { token, user } = await loginUser(body);

    console.log(token);

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token não encontrado" });
    }

    const payload = verifyToken(token);

    if (typeof payload === "string") {
      throw new Error("Token inválido");
    }

    const newAccessToken = generateToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    return res.json({ token: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh-token",
  });
  return res.status(200).json({ message: "Logout realizado com sucesso" });
}