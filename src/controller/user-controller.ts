import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export const userController = new Hono<{ Variables: ApplicationVariables }>()

userController.put('/users/:id', async (c) => {
    const user = c.get('user')
    const request = await c.req.json() as UpdateUserRequest

    const response = await UserService.update(user, request)

    return c.json({
        message: "Update User Successfully"
    })
})