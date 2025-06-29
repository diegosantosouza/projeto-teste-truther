import { UserListInput, UserListOutput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { removeUserPassword } from '@/shared/helpers';

export class UserListUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserListUseCase.Input): Promise<UserListUseCase.Output> {
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
    const users = await this.userRepository.find(criteria);
    return users.map(removeUserPassword);
  }
}

export namespace UserListUseCase {
  export type Input = UserListInput;

  export type Output = UserListOutput;
}
