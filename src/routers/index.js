import { Router } from "express"
import staffRouter from "./staff.route.js"
import authRouter from "./auth.route.js"
import teacherRouter from "./teacher.route.js"
import mentorRouter from "./mentors.route.js"
import studentRouter from "./students.route.js"
import categoriesRouter from "./category.route.js"
import coursesRouter from "./courses.route.js"
import sectionsRouter from "./sections.route.js"
import lessonsRouter from "./lessons.route.js"
import materialsRouter from "./materials.route.js"






const main = Router();

// Staff router'ni ulaymiz
main
.use("/api/v1", staffRouter)
.use("/api/v1",authRouter)
.use("/api/v1",teacherRouter)
.use("/api/v1/",mentorRouter)
.use("/api/v1/",studentRouter)
.use("/api/v1/",categoriesRouter)
.use("/api/v1/",coursesRouter)
.use("/api/v1/",sectionsRouter)
.use("/api/v1/",lessonsRouter)
.use("/api/v1/",materialsRouter)



export default main;