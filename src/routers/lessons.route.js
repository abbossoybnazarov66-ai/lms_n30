import { Router } from "express";
import lessonController from "../controllers/lessons.controller.js";
import middleWare from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

const router = Router();

router
    .get("/lessons", authGuard, roleGuard("admin", "teacher"), lessonController.getLessons)
    .get("/lessons/:section_id", authGuard, roleGuard("admin", "teacher"), lessonController.getSectionsByUserId)
    .post("/lessons", authGuard, roleGuard("teacher"), middleWare.lessonCreate, lessonController.createLessons)
    .put("/lessons/:id", authGuard, roleGuard("teacher"), middleWare.lessonUpdate, lessonController.updateLessons)
    .delete("/lessons/:id", authGuard, roleGuard("teacher"), lessonController.deleteLessons)

export default router;