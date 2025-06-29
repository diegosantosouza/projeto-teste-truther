import { UserRepository } from '@/modules/user/repositories';
import { UserUpdateUseCase } from '@/modules/user/usecases';
import { UserUpdateHttpController } from '@/modules/user/controllers';

export const makeUserUpdateController = (): UserUpdateHttpController => {
  const userRepository = new UserRepository();
  const userUpdateUseCase = new UserUpdateUseCase(userRepository);
  return new UserUpdateHttpController(userUpdateUseCase);
};