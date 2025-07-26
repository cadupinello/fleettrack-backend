import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      errors: err.flatten().fieldErrors
    })
  }

  return res.status(500).json({
    message: 'Internal server error'
  })
}