import {Router} from "express";
import healthcheckRoutes from "./modules/health-check/routes/healthcheckRoutes.js";
import snippetRouter from "./modules/snippets/routes/snippetRoutes.js";

const router = new Router();

router.use("/api/v1/health-check", healthcheckRoutes);
router.use("/api/v1/snippets", snippetRouter);

router.get("", (req, res) => res.status(200).send('Snippet Manager server running!'));

export default router;
