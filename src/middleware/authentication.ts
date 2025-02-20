import { Context, Next } from "hono";
import { UserService } from "../service/user-service";

export const authenticationMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')
    const user = await UserService.get(token)

    c.set('jwtPayload', user)

    await next()
}