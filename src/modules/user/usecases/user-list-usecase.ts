import { UserListInput, UserListOutput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { removeUserPassword } from '@/shared/helpers';

export class UserListUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserListUseCase.Input): Promise<UserListUseCase.Output> {
    const users = await this.userRepository.find(input);
    return users.map(removeUserPassword);
  }
}

export namespace UserListUseCase {
  export type Input = UserListInput;

  export type Output = UserListOutput;
}
