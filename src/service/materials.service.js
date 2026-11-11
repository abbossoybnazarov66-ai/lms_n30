import fs from "fs"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

const FILE_TYPES = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "application/zip": "zip",
    "video/mp4": "mp4"
}
const FILE_DIR = process.cwd() + "/src/uploads/materials/"
fs.mkdirSync(FILE_DIR, { recursive: true })

class materialsService {

    async getMaterials(req, res, next) {
        try {
            const materials = await pool.query(
                `select m.id, m.lesson_id, m.description, m.file
                 from materials m
                 join lessons l on l.id = m.lesson_id
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where m.status = 'active'
                   and ($1::text <> 'teacher' or c.teacher_id = $2)
                 order by m.id`,
                [req.user.role, req.user.id]
            )
            return { status: 200, data: materials.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getMyMaterials(req, res, next) {
        try {
            const { lesson_id } = req.params

            const lesson = await pool.query(
                `select l.id, c.teacher_id
                 from lessons l
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where l.id = $1 and l.status = 'active'`,
                [lesson_id]
            )
            if (!lesson.rows.length) {
                return next(new ErrorException(404, "lesson not found"))
            }
            if (req.user.role == "teacher" && lesson.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your lesson"))
            }

            const materials = await pool.query(
                "select id, description, file from materials where lesson_id = $1 and status = 'active' order by id",
                [lesson_id]
            )
            return { status: 200, data: materials.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createMaterials(req, res, next) {
        try {
            const { lesson_id, description } = req.body
            const file = req.files?.file

            const lesson = await pool.query(
                `select l.id, c.teacher_id
                 from lessons l
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where l.id = $1 and l.status = 'active'`,
                [lesson_id]
            )
            if (!lesson.rows.length) {
                return next(new ErrorException(404, "lesson not found"))
            }
            if (lesson.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your lesson"))
            }

            if (!file) {
                return next(new ErrorException(400, "file must be uploaded"))
            }
            if (Array.isArray(file)) {
                return next(new ErrorException(400, "only one file is allowed"))
            }
            if (!FILE_TYPES[file.mimetype]) {
                return next(new ErrorException(415, "Unsupported file type. Allowed: pdf, png, jpg, zip, mp4"))
            }

            const fileName = Date.now() + "." + FILE_TYPES[file.mimetype]
            await file.mv(FILE_DIR + fileName)

            await pool.query(
                "insert into materials (lesson_id, description, file) values ($1, $2, $3)",
                [lesson_id, description || null, fileName]
            )

            return { status: 201, message: "material successfully added" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateMaterials(req, res, next) {
        try {
            const { id } = req.params
            const { description } = req.body

            const material = await pool.query(
                `select m.id, c.teacher_id
                 from materials m
                 join lessons l on l.id = m.lesson_id
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where m.id = $1 and m.status = 'active'`,
                [id]
            )
            if (!material.rows.length) {
                return next(new ErrorException(404, "material not found"))
            }
            if (material.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your material"))
            }

            await pool.query(
                "update materials set description = coalesce($1, description) where id = $2",
                [description || null, id]
            )

            return { status: 200, message: "successfully updated" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteMaterials(req, res, next) {
        try {
            const { id } = req.params

            const material = await pool.query(
                `select m.id, c.teacher_id
                 from materials m
                 join lessons l on l.id = m.lesson_id
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where m.id = $1 and m.status = 'active'`,
                [id]
            )
            if (!material.rows.length) {
                return next(new ErrorException(404, "material not found"))
            }
            if (material.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your material"))
            }

            await pool.query("update materials set status = 'inactive' where id = $1", [id])

            return { status: 200, message: "material is deleted" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let materialsservice = new materialsService()
export default materialsservice