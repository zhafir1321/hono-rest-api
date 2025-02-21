import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { AuthorRequest, AuthorResponse, AuthorsResponse, toAuthorResponse, toAuthorsResponse } from "../model/author-model";
import { AuthorValidation } from "../validation/author-validation";
import { Gender } from "@prisma/client";
import { AuthorQuery, Pagination } from "../model/app-model";
import { PaginationValidation } from "../validation/pagination-validation";
import { FilterValidation } from "../validation/filter-validation";

export class AuthorService {
    static async createAuthor(request: AuthorRequest): Promise<string> { 
        request = AuthorValidation.CREATE.parse(request)

        

        const existAuthor = await prismaClient.author.count({
            where: {
                name: request.name
            }
        })

        if (existAuthor != 0) {
            throw new HTTPException(400, {
                message: "Author already exists"
            })
        }

        let name = request.name.toUpperCase();
        name = name.replace(/\s+/g, '');
        const firstChar = name.charAt(0);
        const lastChar = name.charAt(name.length - 1);
        const middleChars = name.substring(1, name.length - 1);
        const thirdChar = middleChars.charAt(Math.floor(middleChars.length / 2) - 1);
        const fourthChar = middleChars.charAt(Math.floor(middleChars.length / 2));

        const code = `${firstChar}${thirdChar}${fourthChar}${lastChar}`;

        // Save the author with the generated code
        await prismaClient.author.create({
            data: {
                name: request.name,
                gender: request.gender as Gender,
                code: code
            }
        });

        return code;
    }

    static async getAuthors(pagination: Pagination, filter: AuthorQuery): Promise<AuthorsResponse> {
        pagination = PaginationValidation.PAGINATION.parse(pagination)
        filter = FilterValidation.AUTHOR_QUERY.parse(filter)
        const page = pagination.page
        const limit = pagination.limit

        const totalRows = await prismaClient.author.count({
            where: {
                name: {
                    contains: filter.name
                },
                code: {
                    contains: filter.code
                }
            }
        })

        const totalPages = Math.ceil(totalRows / limit)

        const offset = (page - 1) * limit
        
        const authors = await prismaClient.author.findMany({
            where: {
                name: {
                    contains: filter.name
                },
                code: {
                    contains: filter.code
                }
            },
            include: {
                Book: true
            },
            skip: offset,
            take: limit
        })

        const authorsResponse = toAuthorsResponse(authors)

        return {
            page: page,
            totalPages: totalPages,
            totalRows: totalRows,
            limit: limit,
            message: "Authors retrieved successfully",
            data: authorsResponse
        } as AuthorsResponse
    }

    static async getAuthorById(id: string): Promise<AuthorResponse> { 
        const authorId = parseInt(id)
        const author = await prismaClient.author.findUnique({
            where: {
                id: authorId
            }
        })

        if (!author) {
            throw new HTTPException(404, {
                message: "Author not found"
            })
        }

        return toAuthorResponse(author)
    }
}