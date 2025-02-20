import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1).max(24),
        password: z.string().min(6).max(12),
        email: z.string().email()
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    })

    static readonly TOKEN: ZodType = z.string().min(1)
}