import materialsService from "../service/materials.service.js"

class materialsController {

    async getMaterials(req, res, next) {
        try {
            const resData = await materialsService.getMaterials(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async getMyMaterials(req, res, next) {
        try {
            const resData = await materialsService.getMyMaterials(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async createMaterials(req, res, next) {
        try {
            const resData = await materialsService.createMaterials(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async updateMaterials(req, res, next) {
        try {
            const resData = await materialsService.updateMaterials(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }

    async deleteMaterials(req, res, next) {
        try {
            const resData = await materialsService.deleteMaterials(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(error)
        }
    }
}

let materialscontroller = new materialsController()
export default materialscontroller