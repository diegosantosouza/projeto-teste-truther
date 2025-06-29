import { UserUpdateOutput, UserUpdateInput, UserIdInput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { NotFoundError, ServerError } from '@/shared/errors';
import { PasswordService } from '@/modules/user/services';
import { removeUserPassword } from '@/shared/helpers';

export class UserUpdateUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserUpdateUseCase.Input): Promise<UserUpdateUseCase.Output> {
    const userExists = await this.userRepository.findById(input.id);
    if (!userExists) {
      throw new NotFoundError('User not found')
    }

    if (input.password) {
      input.password = await PasswordService.hash(input.password)
    }
    const user = await this.userRepository.update(input.id, input);
    if (!user) {
      throw new ServerError('Failed to update user')
    }
    return removeUserPassword(user);
  }
}

export namespace UserUpdateUseCase {
  export type Input = UserUpdateInput & UserIdInput;

  export type Output = UserUpdateOutput;
}
