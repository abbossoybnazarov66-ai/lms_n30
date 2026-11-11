import { Router } from "express";
import materialsController from "../controllers/materials.controller.js";
import middleWare from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const router = Router();

router
    .get("/materials", authGuard, roleGuard("admin", "teacher"), materialsController.getMaterials)
    .get("/materials/:lesson_id", authGuard, roleGuard("admin", "teacher"), materialsController.getMyMaterials)
    .post("/materials", authGuard, roleGuard("teacher"), middleWare.materialsCreate, materialsController.createMaterials)
    .put("/materials/:id", authGuard, roleGuard("teacher"), middleWare.materialsUpdate, materialsController.updateMaterials)
    .delete("/materials/:id", authGuard, roleGuard("teacher"), materialsController.deleteMaterials)

export default router;