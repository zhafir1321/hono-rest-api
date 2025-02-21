import { z, ZodType } from "zod";

export class PaginationValidation {
    static readonly PAGINATION: ZodType = z.object({
        page: z.number().int().optional(),
        limit: z.number().int().optional()
    })
}