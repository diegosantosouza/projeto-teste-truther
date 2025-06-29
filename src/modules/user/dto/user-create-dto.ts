import { z } from 'zod'
import { User, UserRole } from '@/modules/user/entities'

export const UserCreateInputSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.nativeEnum(UserRole)),
})

export type UserCreateInput = z.infer<typeof UserCreateInputSchema>
export type UserCreateOutput = Omit<User, 'password'>;
