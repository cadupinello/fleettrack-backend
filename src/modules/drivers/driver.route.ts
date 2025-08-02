import { requireAuth } from "@/middlewares/requireAuth";
import { validate } from "@/middlewares/validate";
import { requireAdmin } from "@/utils/asyncHandler";
import { Router } from "express";
import { driverController } from "./driver.controller";
import { driverSchema } from "./driver.schema";

const router = Router();

router.post("/", requireAuth, requireAdmin, validate(driverSchema), driverController.create);
router.get("/", driverController.getAll);

export default router;