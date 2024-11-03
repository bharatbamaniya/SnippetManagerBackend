import { Router } from "express";
import healthcheckRoutes from "./modules/health-check/routes/healthcheckRoutes.js";

const router = new Router();

router.use("/api/v1/health-check", healthcheckRoutes);

export default router;
