import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class sectionsService {

    async getSections(req, res, next) {
        try {
            const sections = await pool.query(
                "select * from sections where status = 'active' order by id"
            )
            return { status: 200, data: sections.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async getMySection(req, res, next) {
        try {
            const { course_id } = req.params

            const course = await pool.query("select * from courses where id = $1", [course_id])
            if (!course.rows.length) {
                return next(new ErrorException(404, "course not found"))
            }
            if (req.user.role == "teacher" && course.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "this is not your course"))
            }

            const sections = await pool.query(
                "select id, name from sections where course_id = $1 and status = 'active' order by id",
                [course_id]
            )
            return { status: 200, data: sections.rows }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createSections(req, res, next) {
        try {
            const { name, course_id } = req.body

            const existCourse = await pool.query("select * from courses where id = $1", [course_id])
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "course not found"))
            }
            if (existCourse.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "you cannot add to this course"))
            }
            if (existCourse.rows[0].status !== "active") {
                return next(new ErrorException(400, "course is not active"))
            }

            const existName = await pool.query(
                "select id from sections where name = $1 and course_id = $2 and status = 'active'",
                [name, course_id]
            )
            if (existName.rows.length) {
                return next(new ErrorException(409, "section already exists"))
            }

            await pool.query("insert into sections (name, course_id) values ($1, $2)", [name, course_id])

            return { status: 201, message: "section successfully added" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateSections(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body

            const existSection = await pool.query(
                "select id from sections where id = $1 and status = 'active'", [id]
            )
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "section not found"))
            }

            await pool.query("update sections set name = $1 where id = $2", [name, id])

            return { status: 200, message: "successfully updated" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteSections(req, res, next) {
        try {
            const { id } = req.params

            const existSection = await pool.query(
                "select id from sections where id = $1 and status = 'active'", [id]
            )
            if (!existSection.rows.length) {
                return next(new ErrorException(404, "section not found"))
            }

            await pool.query("update sections set status = 'inactive' where id = $1", [id])

            return { status: 200, message: "section is deleted" }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let sectionsservice = new sectionsService()
export default sectionsservice