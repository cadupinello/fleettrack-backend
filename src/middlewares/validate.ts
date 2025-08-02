import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ZodObject, ZodSchema } from 'zod'

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {

    const isZodObject = schema instanceof ZodObject
    const hasUserId = isZodObject && 'userId' in schema.shape

    if (hasUserId) {
      try {
        const token = req.cookies['refresh-token']
        if (!token) {
          return res.status(401).json({ message: 'Token não encontrado' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          sub: string
        }

        req.body = {
          ...req.body,
          userId: decoded.sub
        }
      } catch (error) {
        return res.status(401).json({ message: 'Token inválido' })
      }
    }

    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: result.error.issues,
      })
    }

    req.body = result.data
    return next()
  }