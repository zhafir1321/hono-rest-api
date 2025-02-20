import { z, ZodType } from "zod";

export class BookValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(25),
        authorId: z.number()
    })
}