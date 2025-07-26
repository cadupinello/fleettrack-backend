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
    const user = await loginUser(body);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
