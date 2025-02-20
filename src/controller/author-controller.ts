import { Hono } from "hono";
import { AuthorRequest } from "../model/author-model";
import { AuthorService } from "../service/author-service";

export const authorController = new Hono()

authorController.post('/authors', async (c) => {
    const request = await c.req.json() as AuthorRequest

    const response = await AuthorService.createAuthor(request)

    return c.json({
        message: "Author created successfully",
    })
})

authorController.get('/authors', async (c) => {
    const response = await AuthorService.getAuthors()

    return c.json({
        response
    })
})

authorController.get('/authors/:id', async (c) => {
    const authorId = c.req.param('id')

    const response = await AuthorService.getAuthorById(authorId)
    return c.json({
        response
    })
})
