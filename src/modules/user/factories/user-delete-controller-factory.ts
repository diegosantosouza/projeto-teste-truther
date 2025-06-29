import { UserRepository } from '@/modules/user/repositories';
import { UserDeleteUseCase } from '@/modules/user/usecases';
import { UserDeleteHttpController } from '@/modules/user/controllers';

export const makeUserDeleteController = (): UserDeleteHttpController => {
  const userRepository = new UserRepository();
  const userDeleteUseCase = new UserDeleteUseCase(userRepository);
  return new UserDeleteHttpController(userDeleteUseCase);
};