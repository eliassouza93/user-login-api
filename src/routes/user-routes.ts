import { Router } from "express";
import { UserController } from "../controllers/user-controllers";
import { middlewares } from "../middlewere";

const router = Router();
const userController = new UserController();

router.get("/", userController.index);
router.post("/", middlewares.validatePostUser, userController.create);
router.put("/:id", middlewares.validadeEditUser, userController.update);
router.delete("/:id", userController.delete);

export default router;
