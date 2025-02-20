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