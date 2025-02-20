import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export const userController = new Hono()

userController.post('/register', async (c) => {
    const request = await c.req.json() as RegisterUserRequest

    const response = await UserService.registerUser(request)

    return c.json({
        message: "Register User Successfully",
    })
})

userController.post('/login', async (c) => {
    const request = await c.req.json() as LoginUserRequest
    const response = await UserService.loginUser(request)

    return c.json({
        message: "Login User Successfully",
        token: response
    })
})
