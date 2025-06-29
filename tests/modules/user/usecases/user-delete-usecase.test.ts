import { UserDeleteUseCase } from '@/modules/user/usecases/user-delete-usecase';
import { MockUserRepository } from '../__mocks__/user-repository.mock';
import { UserFactory } from '../__mocks__/user-factory';
import { NotFoundError } from '@/shared/errors/not-found-error';

describe('UserDeleteUseCase', () => {
  let useCase: UserDeleteUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UserDeleteUseCase(mockRepository as any);
    mockRepository.clearMockData();
  });

  it('should delete user successfully', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({ id: '507f1f77bcf86cd799439011' });

    expect(result).toBe(true);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockRepository.setMockData([]);

    await expect(useCase.execute({ id: '507f1f77bcf86cd799439012' })).rejects.toThrow(NotFoundError);
  });

  it('should return true when user is deleted', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({ id: '507f1f77bcf86cd799439011' });

    expect(result).toBe(true);
  });
}); 