import { Context, Next } from "hono";
import { UserService } from "../service/user-service";

export const authenticationMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    const user = await UserService.get(token)

    c.set('user', user)

    await next()
}