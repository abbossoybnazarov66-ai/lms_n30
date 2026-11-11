import fs from "fs"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/svg+xml": "svg" }
const VIDEO_TYPES = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" }

const BANNER_DIR = process.cwd() + "/src/uploads/banner/"
const VIDEO_DIR = process.cwd() + "/src/uploads/introVideo/"
fs.mkdirSync(BANNER_DIR, { recursive: true })
fs.mkdirSync(VIDEO_DIR, { recursive: true })

class courseService {



    async getMyCourses(req) {
        try {
            let mentorId = req.user.id;

            let courses = await pool.query(
                `
                SELECT c.*, cat.name as category_name
                FROM courses c
                LEFT JOIN categories cat ON c.category_id = cat.id
                WHERE c.teacher_id = $1
                `,
                [mentorId]
            );

            if (courses.rows.length === 0) {
                return {
                    status: 200,
                    message: "Siz hali hech qanday kurs yaratmagansiz",
                    data: []
                };
            }

            return {
                status: 200,
                message: "Sizning kurslaringiz muvaffaqiyatli olindi",
                data: courses.rows
            };

        } catch (error) {
            return {
                status: 500,
                message: error.message,
                data: []
            };
        }
    }



 async getCourses(req, res, next) {
    try {
        let courses

        if (req.user.role === "teacher") {
            courses = await pool.query(
                `select id, banner, intro_video, name, description, price, teacher_id, category_id, level, status
                 from courses
                 where coalesce(status, 'active') <> 'inactive' and teacher_id = $1
                 order by id`,
                [req.user.id]
            )
        } else {
            courses = await pool.query(
                `select id, banner, intro_video, name, description, price, teacher_id, category_id, level, status
                 from courses
                 where coalesce(status, 'active') <> 'inactive'
                 order by id`
            )
        }

        return { status: 200, data: courses.rows }
    } catch (error) {
        return next(new ErrorException(500, error))
    }
}

    async createCourses(req, res, next) {
        try {
            const { name, description, level, price, category_id } = req.body
            const banner = req.files?.banner
            const introVideo = req.files?.introVideo
            const teacheId = req.user.id

            const existCourse = await pool.query(
                "select id from courses where name = $1 and coalesce(status, 'active') <> 'inactive'",
                [name]
            )
            if (existCourse.rows.length) {
                return next(new ErrorException(409, "Course already exist!"))
            }

            if (!banner) {
                return next(new ErrorException(400, "Course banner must be uploaded"))
            }
            if (!IMAGE_TYPES[banner.mimetype]) {
                return next(new ErrorException(415, "Unsupported banner type. Allowed: png, jpg, jpeg, svg"))
            }
            if (introVideo && !VIDEO_TYPES[introVideo.mimetype]) {
                return next(new ErrorException(415, "Unsupported video type. Allowed: mp4, webm, mov"))
            }

            const existCategory = await pool.query(
                "select id from categories where id = $1",
                [category_id]
            )
            if (!existCategory.rows.length) {
                return next(new ErrorException(404, "category not found"))
            }

            const fileNameBanner = Date.now() + "." + IMAGE_TYPES[banner.mimetype]
            await banner.mv(BANNER_DIR + fileNameBanner)

            let fileNameIntroVideo = null
            if (introVideo) {
                fileNameIntroVideo = Date.now() + "." + VIDEO_TYPES[introVideo.mimetype]
                await introVideo.mv(VIDEO_DIR + fileNameIntroVideo)
            }

            await pool.query(
                `insert into courses
                    (banner, intro_video, name, description, level, price, category_id, teacher_id)
                 values ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [fileNameBanner, fileNameIntroVideo, name, description, level, price, category_id, teacheId]
            )

            return {
                status: 201,
                message: "Course added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateCourses(req, res, next) {
        try {
            const { id } = req.params
            const { name, description, level, price, category_id } = req.body

            const existCourse = await pool.query(
                "select * from courses where id = $1 and coalesce(status, 'active') <> 'inactive'",
                [id]
            )
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "course not found"))
            }

            if (req.user.role === "teacher" && existCourse.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "you cannot change this course"))
            }

            if (category_id) {
                const existCategory = await pool.query(
                    "select id from categories where id = $1",
                    [category_id]
                )
                if (!existCategory.rows.length) {
                    return next(new ErrorException(404, "category not found"))
                }
            }

            await pool.query(
                `update courses set
                    name        = coalesce($1, name),
                    description = coalesce($2, description),
                    level       = coalesce($3, level),
                    price       = coalesce($4, price),
                    category_id = coalesce($5, category_id)
                 where id = $6`,
                [
                    name || null,
                    description || null,
                    level || null,
                    price || null,
                    category_id || null,
                    id
                ]
            )

            return {
                status: 200,
                message: "successfully updated"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteCourses(req, res, next) {
        try {
            const { id } = req.params

            const existCourse = await pool.query(
                "select id, teacher_id from courses where id = $1 and coalesce(status, 'active') <> 'inactive'",
                [id]
            )
            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "course not found"))
            }

            if (req.user.role === "teacher" && existCourse.rows[0].teacher_id !== req.user.id) {
                return next(new ErrorException(403, "you cannot delete this course"))
            }

            await pool.query("update courses set status = 'inactive' where id = $1", [id])

            return {
                status: 200,
                message: "course is deleted"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let courseservice = new courseService()

export default courseservice