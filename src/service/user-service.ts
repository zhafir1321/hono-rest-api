import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { LoginUserRequest, Payload, RegisterUserRequest, toUserResponse, toUsersResponse, UpdateUserRequest, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from 'hono/http-exception'
import {sign, decode} from 'hono/jwt'

const secret = Bun.env.JWT_SECRET!
export class UserService {
    static async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        // validasi
        request = UserValidation.REGISTER.parse(request)
        
        const existUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
        })

        if (existUsername != 0) {
            throw new HTTPException(400, {
                message: "Username already exists"
            })
        }

        const existEmail = await prismaClient.user.count({
            where: {
                email: request.email
            }
        })

        if (existEmail != 0) {
            throw new HTTPException(400, {
                message: "Email already exists"
            })
        }

        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        })

        const user = await prismaClient.user.create({
            data: request
        })

        return toUserResponse(user)
    }

    static async loginUser(request: LoginUserRequest): Promise<string> {
        request = UserValidation.LOGIN.parse(request)

        const user = await prismaClient.user.findUnique({
            where: {
                username: request.username
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Username or password is wrong"
            })
        }

        const isValidPassword = await Bun.password.verify(request.password, user.password, "bcrypt")

        if (!isValidPassword) {
            throw new HTTPException(401, {
                message: "Username or password is wrong"
            })
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email, 
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) 
        } as Payload

        

        const token = await sign(payload, secret, "HS256")
        
    
        
        

        return token
    }

    static async get(token: string | undefined | null): Promise<User> {

        const result = UserValidation.TOKEN.safeParse(token)

        if (result.error) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }


        
       const payload = decode(token!).payload as Payload

        if (!payload) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }

        return user
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        request = UserValidation.UPDATE.parse(request)

        if (request.username) {
            user.username = request.username
        }

        if (request.email) {
            user.email = request.email
        }

        if (request.password) {
            user.password = await Bun.password.hash(request.password, {
                algorithm: "bcrypt",
                cost: 10
            })
        }

        user = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        return toUserResponse(user)
    }

}