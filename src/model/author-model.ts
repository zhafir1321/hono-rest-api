import { Author } from "@prisma/client"
import { BookResponse } from "./book-model"

export type AuthorRequest = {
    name: string
    gender: string
}

export type AuthorResponse = {
    id: number
    name: string
    code: string
    gender: string
}

export type AuthorsResponse = {
    page: number
    totalPages: number
    totalRows: number
    limit: number
    message: string
    data: AuthorResponse[]
}

export function toAuthorResponse(author: Author): AuthorResponse {
    return {
        id: author.id,
        name: author.name,
        gender: author.gender,
        code: author.code,
        
    }
}

export function toAuthorsResponse(authors: Author[]): AuthorResponse[] {
    return authors.map(toAuthorResponse)
}