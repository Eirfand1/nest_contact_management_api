import { z, ZodType } from 'zod'

export class AddressValidation {
    static readonly CREATE: ZodType = z.object({
        street: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        province: z.string().min(1).optional(),
        country: z.string().min(1),
        postal_code: z.string().min(1)
    });

     static readonly UPDATE: ZodType = z.object({
        street: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        province: z.string().min(1).optional(),
        country: z.string().min(1),
        postal_code: z.string().min(1)
    });

}