import { BaseRepository } from '@/shared/repository/repository';
import { UserInterface, UserSchema } from '@/modules/user/schemas';
import { BaseModel } from '@/shared/models/base-model';
import { User } from '@/modules/user/entities';

export class UserRepository extends BaseRepository<UserInterface, Omit<User, keyof BaseModel>> {
  constructor() {
    super(UserSchema);
  }
}
