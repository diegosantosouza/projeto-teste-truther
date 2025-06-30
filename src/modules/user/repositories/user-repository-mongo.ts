import { BaseRepository } from '@/shared/repository/repository';
import { UserInterface, UserSchema } from '@/modules/user/schemas';
import { BaseModel } from '@/shared/models/base-model';
import { User } from '@/modules/user/entities';
import { UserListInput, UserUpdateInput } from '@/modules/user/dto';

export class UserRepository extends BaseRepository<UserInterface, Omit<User, keyof BaseModel>> {
  constructor() {
    super(UserSchema);
  }

  async find(input: UserListInput): Promise<UserInterface[]> {
    const criteria: { [key: string]: unknown } = {};
    if (input.name) {
      criteria.name = { $regex: input.name, $options: 'i' };
    }
    if (input.email) {
      criteria.email = { $regex: input.email, $options: 'i' };
    }
    if (input.roles) {
      criteria.roles = { $in: [input.roles] };
    }
    return UserSchema.find(criteria).then(docs => docs.map(doc => doc.toJSON() as UserInterface));
  }

  async update(id: string, data: UserUpdateInput): Promise<UserInterface | null> {
    if (data.roles) {
      data.roles = Array.from(new Set(data.roles));
    }
    return UserSchema.findByIdAndUpdate(id, data, { new: true }).then(doc => doc?.toJSON() as UserInterface ?? null);
  }
}
