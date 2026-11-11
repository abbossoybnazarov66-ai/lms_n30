import { Router } from "express";
import sectionController from "../controllers/section.controller.js";
import middleWare from "../middlewares/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import {roleGuard} from "../guards/role.guard.js"

const router = Router();

router
.get("/sections",authGuard,roleGuard("teacher"),sectionController.getsections)
.get("/sections/:course_id",authGuard,roleGuard("teacher"),sectionController.getMySections)


.post("/sections",authGuard,roleGuard("teacher") ,sectionController.createSections)

.put("/sections/:id",authGuard,roleGuard("teacher"),sectionController.updateSections)
.delete("/sections/:id",authGuard,roleGuard("teacher"),sectionController.deleteSections)



export default router;