import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { BookRequest, BookResponse, toBookResponse, toBooksResponse } from "../model/book-model";
import { BookValidation } from "../validation/book-validation";

export class BookService {
    static async createBook(request: BookRequest): Promise<BookResponse> {
        request = BookValidation.CREATE.parse(request)

        const response = await prismaClient.book.create({
            data: request
        })
        return toBookResponse(response)
    }

    static async getBooks(): Promise<BookResponse[]> { 
        const books = await prismaClient.book.findMany()

        return toBooksResponse(books)
    }

    static async getBookById(id: string): Promise<BookResponse> { 
        const bookId = parseInt(id)
        const book = await prismaClient.book.findUnique({
            where: {
                id: bookId
            }
        })

        if (!book) {
            throw new HTTPException(404, {
                message: "Book not found"
            })
        }
        return toBookResponse(book)
    }
}