import {Router} from "express";
import snippetController from "../controllers/snippetController.js";

const snippetRouter = new Router();

snippetRouter.route("/").get(snippetController.getAll).post(snippetController.add);
snippetRouter.post("/update/:id", snippetController.updateById);
snippetRouter.post("/delete/:id", snippetController.deleteById);

export default snippetRouter;
