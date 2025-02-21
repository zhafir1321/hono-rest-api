import { Hono } from "hono";
import { AuthorRequest } from "../model/author-model";
import { AuthorService } from "../service/author-service";
import { AuthorQuery, Pagination } from "../model/app-model";

export const authorController = new Hono()

authorController.post('/authors', async (c) => {
    const request = await c.req.json() as AuthorRequest

    const response = await AuthorService.createAuthor(request)

    return c.json({
        message: "Author created successfully",
    })
})

authorController.get('/authors', async (c) => {
    const pagination = {
        page: Number(c.req.query('page')) || 1,
        limit: Number(c.req.query('limit')) || 10
    } as Pagination

    const filter = {
        name: c.req.query('name'),
        code: c.req.query('code')
    } as AuthorQuery
    const response = await AuthorService.getAuthors(pagination, filter)

    return c.json(response)
})

authorController.get('/authors/:id', async (c) => {
    const authorId = c.req.param('id')

    const response = await AuthorService.getAuthorById(authorId)
    return c.json({
        response
    })
})
