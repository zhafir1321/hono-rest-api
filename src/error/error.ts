import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export const errorHandler = async (err: Error, c: Context) => {
    if (err instanceof HTTPException) {
        c.status(err.status)
        return c.json({
            errors: err.message
        })
    } else if (err instanceof ZodError) {
        const errorObject: { [key: string]: string } = {}
        err.errors.forEach((error) => {
            if (error.path[0] === 'gender') {
                errorObject['gender'] = "Please select a gender"
            } else {
                errorObject[error.path.join('.')] = error.message
            }
        })
        c.status(400)
        return c.json({
            errors: errorObject
        })
    } else {
        c.status(500)
        return c.json({
            errors: err.message
        })
    }
}