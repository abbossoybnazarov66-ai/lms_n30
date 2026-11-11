import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class categoryService {

    async getCategories(req, res, next) {
        try {
            const categories = await pool.query(`select * from categories where status = 'active' order by id `)

            return {

                status: 200,
                data: categories.rows
            }

        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async createCategories(req, res, next) {
        try {
            const { name } = req.body

            let existcategory = await pool.query(
                `select id from categories where name = $1 and status = 'active'`, [name]
            )
            if (existcategory.rows.length) {
                return next(new ErrorException(409, "category already exists"))
            }


            await pool.query(`insert into categories ( name ) 
                values ($1)`,
                [name]
            )

            return {
                status: 200,
                message: "category succesefully  added"
            }

        } catch (error) {
            return next(new ErrorException(500, error))

        }

    }

    async deleteCategories(req, res, next) {
        try {
            const { id } = req.params


            let existcategory = await pool.query("select id from categories where id = $1", [id])

            if (!existcategory.rows.length) {

                return new ErrorException(403, "category is not found")
            }

            await pool.query("update categories  set status = 'inactive'  WHERE id = $1", [id]);

            return {
                status: 200,
                message: "category  is delated"
            }



        } catch (error) {

            return next(new ErrorException(500, error))
        }



    }

    async updateCategories(req, res, next) {
        try {

            const { id } = req.params
            const {
                name
            } = req.body


            const existcategory = await pool.query('select * from categories where id=$1', [id]);
            if (!existcategory.rows.length) {
                return new ErrorException(404, "category  not found");
            }

            await pool.query(
                `update categories set 
                  name = coalesce($1, name) where id = $2`,

                [
                    name, id

                ]
            );

            return {
                status: 200,
                message: "successfully updated"
            }
        } catch (error) {

            return next(new ErrorException(500, error));
        }
    }


}

let categoryservice = new categoryService()

export default categoryservice