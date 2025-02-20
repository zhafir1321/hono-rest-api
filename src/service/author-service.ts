import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import { AuthorRequest, AuthorResponse, toAuthorResponse, toAuthorsResponse } from "../model/author-model";
import { AuthorValidation } from "../validation/author-validation";
import { Gender } from "@prisma/client";

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

    static async getAuthors(): Promise<AuthorResponse[]> {
        const authors = await prismaClient.author.findMany({
            include: {
                Book: true
            }
        })

        return toAuthorsResponse(authors)
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