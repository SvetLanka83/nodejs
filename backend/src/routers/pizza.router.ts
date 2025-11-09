import { Router } from "express";

import { pizzaController } from "../controllers/pizza.controller";

const router = Router();
router.get("/", pizzaController.getAll);
router.post("/", pizzaController.create);

export const pizzaRouter = router;
