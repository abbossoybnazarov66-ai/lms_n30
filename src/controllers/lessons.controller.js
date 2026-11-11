import lessonsService from "../service/lessons.service.js"

class lessonsController {

    async getLessons(req, res, next) {
        try {
            const resData = await lessonsService.getLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async getSectionsByUserId(req, res, next) {
        try {
            const resData = await lessonsService.getSectionsByUserId(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async createLessons(req, res, next) {
        try {
            const resData = await lessonsService.createLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async updateLessons(req, res, next) {
        try {
            const resData = await lessonsService.updateLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async deleteLessons(req, res, next) {
        try {
            const resData = await lessonsService.deleteLessons(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }
}

let lessonscontroller = new lessonsController()
export default lessonscontroller