
import Joi from "joi"

export default {

    staffSchema: (data) => Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77|71)\d{7}$/).required(), role: Joi.string().required(),
        password: Joi.string().min(4).max(20).required(),
        role: Joi.string().required()
    }).validate(data),

    staffUpdateSchema: (data) => Joi.object({
        fullname: Joi.string().min(3).max(100),
        phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77|71)\d{7}$/),
        password: Joi.string().min(4).max(20),
        role: Joi.string().min(3).max(30),
        status: Joi.string().valid("active", "inactive"),
        photo: Joi.string().allow(null, "")
    }).min(1).validate(data),

    mentorSchema: (data) => Joi.object({
        fullname: Joi.string().min(3).max(100),
        phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77|71)\d{7}$/).required(),
        password: Joi.string().min(4).max(20).required()
    }).validate(data),


    studentSchema: (data) => Joi.object({
        fullname: Joi.string().min(3).max(100),
        phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77|71)\d{7}$/).required(),
        password: Joi.string().min(4).max(20).required()
    }).validate(data),


    categorySchema: (data) => Joi.object({
        name: Joi.string().min(3).max(100),
    }).validate(data),

    courseSchema: (data) => Joi.object({
        name: Joi.string().min(3).max(100),
        description: Joi.string().max(1000),
        level: Joi.string().pattern(/^(beginner|elementary|advanced|intermediate)$/).required(),
        price: Joi.number().integer().positive().required(),
        category_id: Joi.number().integer().positive().required(),
        teacher_id : Joi.number().integer().positive().required()


    }).validate(data),

    sectionSchema: (data) => Joi.object({
        name : Joi.string().min(3).max(100),
        course_id : Joi.number().integer().positive().required

    }).validate(data),

        lessonSchema: (data) => Joi.object({
        section_id: Joi.number().integer().positive().required(),
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().max(1000).allow("", null)
    }).validate(data),

    lessonUpdateSchema: (data) => Joi.object({
        name: Joi.string().min(3).max(255),
        description: Joi.string().max(1000).allow("", null)
    }).min(1).validate(data),


        materialSchema: (data) => Joi.object({
        lesson_id: Joi.number().integer().positive().required(),
        description: Joi.string().max(1000).allow("", null)
    }).validate(data),
    

    materialUpdateSchema: (data) => Joi.object({
        description: Joi.string().max(1000).allow("", null).required()
    }).validate(data),
}



