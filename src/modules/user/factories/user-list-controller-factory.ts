import { UserRepository } from '@/modules/user/repositories';
import { UserListUseCase } from '@/modules/user/usecases';
import { UserListHttpController } from '@/modules/user/controllers';

export const makeUserListController = (): UserListHttpController => {
  const userRepository = new UserRepository();
  const userListUseCase = new UserListUseCase(userRepository);
  return new UserListHttpController(userListUseCase);
};