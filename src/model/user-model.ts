import { User } from "@prisma/client";

export type RegisterUserRequest = {
    username: string;
    email: string;
    password: string;
}

export type UserResponse = {
    id: number;
    username: string;
    email: string;
}

export type UpdateUserRequest = {
    username?: string
    email?: string
    password?: string
}

export type Payload = {
    id: number;
    username: string;
    email: string;
    exp: number
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email
    }
}

export function toUsersResponse(users: User[]): UserResponse[] {
    return users.map(toUserResponse)
}