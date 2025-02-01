import {Router} from "express";
import healthcheckRoutes from "./modules/health-check/routes/healthcheckRoutes.js";
import snippetRouter from "./modules/snippets/routes/snippetRoutes.js";
import paymentRouter from "./modules/payment/routes/paymentRoutes.js";
import userRoutes from "./modules/user/routes/userRoutes.js";

const router = new Router();

router.use("/api/v1/health-check", healthcheckRoutes);
router.use("/api/v1/snippets", snippetRouter);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/payment", paymentRouter);

router.get("", (req, res) => res.status(200).send('Snippet Manager server running!'));

export default router;
