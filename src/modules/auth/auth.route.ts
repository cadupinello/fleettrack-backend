import { AuthRequest, requireAuth } from "@/middlewares/requireAuth";
import { validate } from "@/middlewares/validate";
import { asyncHandler, requireAdmin } from "@/utils/asyncHandler";
import { Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { loginController, logoutController, refreshTokenController, registerController } from "./auth.controller";
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

router.get("/profile", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin', requireAuth, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  res.json({ message: 'Você é admin', user: req.user });
}));

router.post("/validate", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.json({ valid: true, user: decoded });
  } catch {
    return res.status(401).json({ valid: false });
  }
});

router.post('/register', validate(registerSchema), registerController)
router.post('/login', validate(loginSchema), loginController)
router.post('/logout', logoutController)
router.post('/refresh-token', refreshTokenController)

export default router