import { UserCreateInput, UserCreateOutput } from '@/modules/user/dto';
import { UserRepository } from '@/modules/user/repositories';
import { EmailInUseError } from '@/shared/errors';
import { PasswordService } from '@/modules/user/services';
import { removeUserPassword } from '@/shared/helpers';

export class UserCreateUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: UserCreateUseCase.Input): Promise<UserCreateUseCase.Output> {
    const userExists = await this.userRepository.findOne({ email: input.email });
    if (userExists) {
      throw new EmailInUseError()
    }
    const hashedPassword = await PasswordService.hash(input.password);
    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    return removeUserPassword(user);
  }
}

export namespace UserCreateUseCase {
  export type Input = UserCreateInput;

  export type Output = UserCreateOutput;
}
