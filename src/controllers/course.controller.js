import courseService from "../service/course.service.js"
class courseController {


    async getMycourses(req, res, next) {
        try {
            const resData = await courseService.getMyCourses(req)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            
            return(error)
        }
    }

    async getCourses(req, res, next) {
        try {
            const resData = await courseService.getCourses(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            
            return(error)
        }
    }

    async createCourses(req, res, next) {

        try {
            const resData = await courseService.createCourses(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteCourses(req, res, next) {

        try {
            const resData = await courseService.deleteCourses(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error.message)
            next(error)

        }
    }
    async updateCourses(req, res, next) {

        const resData = await courseService.updateCourses(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let coursecontroller = new courseController()
export default coursecontroller