
import schema from "../utils/validation.js"
import { ErrorException } from "../utils/error.js"



export default {

    staffCreate: (req, res, next) => {
        try {
            let { error } = schema.staffSchema(req.body)

            if (error) {

                return next(new ErrorException(400, error.message))
            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })

        }


    },
    staffUpdate: (req, res, next) => {
        try {
            let { error } = schema.staffUpdateSchema(req.body);
            if (error) {
                return next(new ErrorException(400, error.message));
            }
            return next();
        } catch (error) {
            return next(error);
        }
    },

    mentorSchema: (req, res, next) => {
        try {
            let { error } = schema.mentorSchema(req.body)
            if (error) {
                return next(new ErrorException(400, error.message))

            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })
        }

    },
    studentCreate: (req, res, next) => {
        try {
            let { error } = schema.studentSchema(req.body)

            if (error) {

                return next(new ErrorException(400, error.message))
            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })

        }

    },
    categoryCreate: (req, res, next) => {
        try {
            let { error } = schema.categorySchema(req.body)

            if (error) {

                return next(new ErrorException(400, error.message))
            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })

        }

    },
    courseCreate: (req, res, next) => {
        try {
            let { error } = schema.courseSchema(req.body)

            if (error) {

                return next(new ErrorException(400, error.message))
            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })

        }

    },
    sectionCreate: (req, res, next) => {
        try {
            let { error } = schema.sectionSchema(req.body)

            if (error) {

                return next(new ErrorException(400, error.message))
            }
            return next()

        } catch (error) {
            console.log("MIDDLEWARE XATO:", error);
            return res.status(500).json({
                status: 500,
                message: "server xatoligi boldiii"
            })

        }

    },
        lessonCreate: (req, res, next) => {
        try {
            let { error } = schema.lessonSchema(req.body || {})
            if (error) {
                return next(new ErrorException(400, error.message))
            }
            return next()
        } catch (error) {
            return next(error)
        }
    },

    lessonUpdate: (req, res, next) => {
        try {
            let { error } = schema.lessonUpdateSchema(req.body || {})
            if (error) {
                return next(new ErrorException(400, error.message))
            }
            return next()
        } catch (error) {
            return next(error)
        }
    },

    materialsCreate: (req, res, next) => {
        try {
            let { error } = schema.materialSchema(req.body || {})
            if (error) {
                return next(new ErrorException(400, error.message))
            }
            return next()
        } catch (error) {
            return next(error)
        }
    },

   materialsUpdate: (req, res, next) => {
        try {
            let { error } = schema.materialUpdateSchema(req.body || {})
            if (error) {
                return next(new ErrorException(400, error.message))
            }
            return next()
        } catch (error) {
            return next(error)
        }
    },
    


}





