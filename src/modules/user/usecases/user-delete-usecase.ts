import { UserDeleteInput, UserDeleteOutput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { NotFoundError, ServerError } from '@/shared/errors';

export class UserDeleteUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserDeleteUseCase.Input): Promise<UserDeleteUseCase.Output> {
    const userExists = await this.userRepository.findById(input.id);
    if (!userExists) {
      throw new NotFoundError('User not found')
    }

    const user = await this.userRepository.delete(input.id);
    if (!user) {
      throw new ServerError('Failed to delete user')
    }
    return true;
  }
}

export namespace UserDeleteUseCase {
  export type Input = UserDeleteInput;

  export type Output = UserDeleteOutput;
}
