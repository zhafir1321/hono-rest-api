import { Hono } from "hono";
import { BookRequest } from "../model/book-model";
import { BookService } from "../service/book-service";
import { logger } from "../application/logging";
import { ApplicationVariables } from "../model/app-model";

export const bookController = new Hono<{Variables: ApplicationVariables}>()

bookController.post('/books', async (c) => {
    const request = await c.req.json() as BookRequest

    const response = await BookService.createBook(request)

    return c.json({
        message: "Book created successfully",
    })
})

bookController.get('/books', async (c) => {
    const response = await BookService.getBooks()
    return c.json({
        response
    })
})

bookController.get('/books/:id', async (c) => {
    const bookId = c.req.param('id')

    const response = await BookService.getBookById(bookId)
    return c.json({
        response
    })
})