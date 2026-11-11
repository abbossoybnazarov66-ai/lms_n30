import sectionService from "../service/sections.service.js"
class sectionController {


    async getsections(req, res, next) {
        try {
            const resData = await sectionService.getSections(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            return (next(error))
        }
    }
    async getMySections(req, res, next) {
        try {
            const resData = await sectionService.getMySection(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {

            return next(error)
        }
    }


    async createSections(req, res, next) {

        try {
            const resData = await sectionService.createSections(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData);

        } catch (error) {
            console.log(error)
            next(error);
        }
    }


    async deleteSections(req, res, next) {

        try {
            const resData = await sectionService.deleteSections(req, res, next)
            if (!resData) return
            return res.status(resData.status).json(resData)
        } catch (error) {
            console.log(error.message)
            next(error)

        }
    }
    async updateSections(req, res, next) {

        const resData = await sectionService.updateSections(req, res, next)
        console.log(resData)
        if (!resData) return
        return res.status(resData.status).json(resData)
    }
}

let sectioncontroller = new sectionController()
export default sectioncontroller