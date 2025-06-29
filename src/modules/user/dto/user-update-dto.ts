import { z } from 'zod'
import { User, UserRole } from '@/modules/user/entities'

export const UserUpdateInputSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roles: z.array(z.nativeEnum(UserRole)).optional(),
})

export type UserUpdateInput = z.infer<typeof UserUpdateInputSchema>
export type UserUpdateOutput = Omit<User, 'password'>;
