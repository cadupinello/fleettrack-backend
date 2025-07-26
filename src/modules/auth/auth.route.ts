import { AuthRequest, requireAuth } from "@/middlewares/requireAuth";
import { validate } from "@/middlewares/validate";
import { asyncHandler, requireAdmin } from "@/utils/asyncHandler";
import { Response, Router } from "express";
import { loginController, registerController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { user } = req;

    return res.status(200).json({
      message: "User found",
      user,
    });
  })
);

router.get('/admin', requireAuth, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  res.json({ message: 'Você é admin', user: req.user });
}));



router.post('/register', validate(registerSchema), registerController)
router.post('/login', validate(loginSchema), loginController)

export default router