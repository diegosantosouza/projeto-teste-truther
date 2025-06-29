import { User } from '@/modules/user/entities'
import { UserIdInput } from './user-id-dto';

export type UserShowOutput = Omit<User, 'password'>;
export type UserShowInput = UserIdInput
