import { UserShowInput, UserShowOutput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { NotFoundError } from '@/shared/errors';
import { removeUserPassword } from '@/shared/helpers';

export class UserShowUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserShowUseCase.Input): Promise<UserShowUseCase.Output> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return removeUserPassword(user);
  }
}

export namespace UserShowUseCase {
  export type Input = UserShowInput;

  export type Output = UserShowOutput;
}
