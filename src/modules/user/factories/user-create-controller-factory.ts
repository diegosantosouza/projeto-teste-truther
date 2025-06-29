import { UserCreateHttpController } from '@/modules/user/controllers';
import { UserRepository } from '@/modules/user/repositories';
import { UserCreateUseCase } from '@/modules/user/usecases';

export const makeUserCreateController = (): UserCreateHttpController => {
  const userRepository = new UserRepository();
  const userCreateUseCase = new UserCreateUseCase(userRepository);
  return new UserCreateHttpController(userCreateUseCase);
};