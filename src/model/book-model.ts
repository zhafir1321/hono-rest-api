import { Book } from "@prisma/client"
import { AuthorResponse } from "./author-model"

export type BookRequest = {
    title: string
    description: string
    authorId: number
}

export type BookResponse = {
    id: number
    title: string
    description: string
    authorId: string
}

export type BooksResponse = {
    page: number
    totalPages: number
    totalRows: number
    limit: number
    message: string
    data: BookResponse[]
}

export function toBookResponse(book: Book): BookResponse {
    return {
        id: book.id,
        title: book.title,
        description: book.description,
        authorId: book.authorId.toString()
    }
}

export function toBooksResponse(books: Book[]): BookResponse[] {
    return books.map(toBookResponse)
}