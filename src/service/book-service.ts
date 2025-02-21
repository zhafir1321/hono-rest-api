import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { BookRequest, BookResponse, BooksResponse, toBookResponse, toBooksResponse } from "../model/book-model";
import { BookValidation } from "../validation/book-validation";
import { BookQuery, Pagination } from "../model/app-model";
import { PaginationValidation } from "../validation/pagination-validation";
import { FilterValidation } from "../validation/filter-validation";
import { Book } from "@prisma/client";

export class BookService {
    static async createBook(request: BookRequest): Promise<BookResponse> {
        request = BookValidation.CREATE.parse(request)

        const response = await prismaClient.book.create({
            data: request
        })
        return toBookResponse(response)
    }

    static async getBooks(pagination: Pagination, filter: BookQuery): Promise<BooksResponse> { 
        pagination = PaginationValidation.PAGINATION.parse(pagination)
        filter = FilterValidation.BOOK_QUERY.parse(filter)
        let books: Book[]
        let totalRows = 0


        
        const page = pagination.page
        const limit = pagination.limit

        if (filter.authorId != 0) {
            totalRows = await prismaClient.book.count({
                where: {
                    title: {
                        contains: filter.title
                    },
                    authorId: {
                        equals: filter.authorId
                    }
                }
            })

             books = await prismaClient.book.findMany({
                where: {
                    title: {
                        contains: filter.title
                    },
                    authorId: {
                        equals: filter.authorId
                    }
                },
                include: {
                    author: true
                }
             })
        } else {
         totalRows = await prismaClient.book.count({
            where: {
                title: {
                    contains: filter.title
                }
            }
        })
        


        const offset = (page - 1) * limit
        

         books = await prismaClient.book.findMany({
            where: {
                title: {
                    contains: filter.title
                }
            },
            include: {
                author: true
            },
            skip: offset,
            take: limit
        })
    }
            const totalPages = Math.ceil(totalRows / limit) 

        const booksResponse = toBooksResponse(books)

        return {
            page: page,
            totalPages: totalPages,
            totalRows: totalRows,
            limit: limit,
            message: "Books retrieved successfully",
            data: booksResponse
        } as BooksResponse
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