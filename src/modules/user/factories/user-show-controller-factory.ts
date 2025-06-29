import { UserRepository } from '@/modules/user/repositories';
import { UserShowUseCase } from '@/modules/user/usecases';
import { UserShowHttpController } from '@/modules/user/controllers';

export const makeUserShowController = (): UserShowHttpController => {
  const userRepository = new UserRepository();
  const userShowUseCase = new UserShowUseCase(userRepository);
  return new UserShowHttpController(userShowUseCase);
};