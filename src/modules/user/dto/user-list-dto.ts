import { z } from 'zod'
import { User, UserRole } from '@/modules/user/entities'

export const UserListInputSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  roles: z.nativeEnum(UserRole).optional(),
})

export type UserListInput = z.infer<typeof UserListInputSchema>
export type UserListOutput = Omit<User, 'password'>[];
