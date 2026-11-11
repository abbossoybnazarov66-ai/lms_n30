import fs from "fs"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

const FILE_TYPES = {
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "application/pdf": "pdf"
}
const FILE_DIR = process.cwd() + "/src/uploads/lessons/"
fs.mkdirSync(FILE_DIR, { recursive: true })

class lessonsService {

    async getLessons(req, res, next) {
        try {
            const lessons = await pool.query(
                `select l.id, l.section_id, l.name, l.file, l.description
                 from lessons l
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where l.status = 'active'
                   and ($1::text <> 'teacher' or c.teacher_id = $2)
                 order by l.id`,
                [req.user.role, req.user.id]
            )
            return { status: 200, data: lessons.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getSectionsByUserId(req, res, next) {
        try {
            const { section_id } = req.params

            const section = await pool.query(
                "select * from sections where id = $1 and status = 'active'",
                [section_id]
            )
            if (!section.rows.length) {
                return next(new ErrorException(404, "section not found"))
            }

            const course = await pool.query(
                "select * from courses where id = $1",
                [section.rows[0].course_id]
            )
            if (req.user.role == "teacher" && course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your course"))
            }

            const lessons = await pool.query(
                "select id, name, file, description from lessons where section_id = $1 and status = 'active' order by id",
                [section_id]
            )
            return { status: 200, data: lessons.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createLessons(req, res, next) {
        try {
            const { section_id, name, description } = req.body
            const file = req.files?.file

            const section = await pool.query(
                "select * from sections where id = $1 and status = 'active'",
                [section_id]
            )
            if (!section.rows.length) {
                return next(new ErrorException(404, "section not found"))
            }

            const course = await pool.query(
                "select * from courses where id = $1",
                [section.rows[0].course_id]
            )
            if (course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your course"))
            }

            if (!file) {
                return next(new ErrorException(400, "lesson file must be uploaded"))
            }
            if (Array.isArray(file)) {
                return next(new ErrorException(400, "only one file is allowed"))
            }
            if (!FILE_TYPES[file.mimetype]) {
                return next(new ErrorException(415, "Unsupported file type. Allowed: mp4, webm, mov, pdf"))
            }

            const exist = await pool.query(
                "select id from lessons where name = $1 and section_id = $2 and status = 'active'",
                [name, section_id]
            )
            if (exist.rows.length) {
                return next(new ErrorException(409, "lesson already exists"))
            }

            const fileName = Date.now() + "." + FILE_TYPES[file.mimetype]
            await file.mv(FILE_DIR + fileName)

            await pool.query(
                "insert into lessons (section_id, name, file, description) values ($1, $2, $3, $4)",
                [section_id, name, fileName, description || null]
            )

            return { status: 201, message: "lesson successfully added" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateLessons(req, res, next) {
        try {
            const { id } = req.params
            const { name, description } = req.body

            const lesson = await pool.query(
                `select l.id, c.teacher_id
                 from lessons l
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where l.id = $1 and l.status = 'active'`,
                [id]
            )
            if (!lesson.rows.length) {
                return next(new ErrorException(404, "lesson not found"))
            }
            if (lesson.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your lesson"))
            }

            await pool.query(
                "update lessons set name = coalesce($1, name), description = coalesce($2, description) where id = $3",
                [name || null, description || null, id]
            )

            return { status: 200, message: "successfully updated" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteLessons(req, res, next) {
        try {
            const { id } = req.params

            const lesson = await pool.query(
                `select l.id, c.teacher_id
                 from lessons l
                 join sections s on s.id = l.section_id
                 join courses c on c.id = s.course_id
                 where l.id = $1 and l.status = 'active'`,
                [id]
            )
            if (!lesson.rows.length) {
                return next(new ErrorException(404, "lesson not found"))
            }
            if (lesson.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your lesson"))
            }

            await pool.query("update lessons set status = 'inactive' where id = $1", [id])

            return { status: 200, message: "lesson is deleted" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let lessonsservice = new lessonsService()
export default lessonsservice