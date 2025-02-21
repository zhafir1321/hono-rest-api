import { z, ZodType } from "zod";

export class FilterValidation {
    static readonly AUTHOR_QUERY: ZodType = z.object({
        name: z.string().optional(),
        code: z.string().optional()
    })

    static readonly BOOK_QUERY: ZodType = z.object({
        title: z.string().optional(),
        authorId: z.number().int().optional()
    })
}