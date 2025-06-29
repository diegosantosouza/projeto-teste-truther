import { z } from 'zod'

export const UserIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
})

export type UserIdInput = z.infer<typeof UserIdSchema>