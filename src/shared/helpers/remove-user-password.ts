import { User } from '@/modules/user/entities';

export const removeUserPassword = (user: User): Omit<User, 'password'> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}