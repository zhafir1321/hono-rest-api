import { User } from "@prisma/client"

export type ApplicationVariables = {
    user: User
}

export type AuthorQuery = {
    name: string
    code: string
    gender: string
}

export type BookQuery = {
    title: string
    authorId: string
}

export type Pagination = {
    page: number
    limit: number
}