import { z, ZodType } from "zod";

export class AuthorValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        gender: z.enum(["male", "female"])
    })

}