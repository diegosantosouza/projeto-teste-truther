import { UserCreateUseCase } from '@/modules/user/usecases/user-create-usecase';
import { MockUserRepository } from '../__mocks__/user-repository.mock';
import { MockPasswordService } from '../__mocks__/password-service.mock';
import { UserFactory } from '../__mocks__/user-factory';
import { EmailInUseError } from '@/shared/errors/email-in-use-error';
import { UserRole } from '@/modules/user/entities/user';

describe('UserCreateUseCase', () => {
  let useCase: UserCreateUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UserCreateUseCase(mockRepository as any);
    mockRepository.clearMockData();
  });

  it('should create a new user with hashed password', async () => {
    const input = {
      name: 'Alice',
      email: 'alice@example.com',
      password: '123456',
      roles: [UserRole.CLIENT]
    };
    const result = await useCase.execute(input);
    expect(result.name).toBe('Alice');
    expect(result.email).toBe('alice@example.com');
    expect((result as any).password).toBeUndefined();
    expect(result.roles).toContain(UserRole.CLIENT);
  });

  it('should throw EmailInUseError if email already exists', async () => {
    const existingUser = UserFactory.createUser({ email: 'bob@example.com' });
    mockRepository.setMockData([existingUser]);
    const input = {
      name: 'Bob',
      email: 'bob@example.com',
      password: '123456',
      roles: [UserRole.CLIENT]
    };
    await expect(useCase.execute(input)).rejects.toThrow(EmailInUseError);
  });
}); 