import { UserCreateHttpController } from '@/modules/user/controllers/user-create-http-controller';
import { UserCreateUseCase } from '@/modules/user/usecases/user-create-usecase';
import { UserFactory } from '../__mocks__/user-factory';
import { UserRole } from '@/modules/user/entities/user';
import { Request } from 'express';

describe('UserCreateHttpController', () => {
  let controller: UserCreateHttpController;
  let mockUseCase: jest.Mocked<UserCreateUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new UserCreateHttpController(mockUseCase);
  });

  it('should create user successfully', async () => {
    const mockUser = UserFactory.createUser();
    mockUseCase.execute.mockResolvedValue(mockUser);

    const mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        roles: [UserRole.CLIENT]
      }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      roles: [UserRole.CLIENT]
    });
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockUser);
  });

  it('should validate required fields', async () => {
    const mockRequest = {
      body: {
        name: 'John',
        email: 'invalid-email',
        password: '123'
      }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow();
  });

  it('should propagate use case errors', async () => {
    const error = new Error('Use case error');
    mockUseCase.execute.mockRejectedValue(error);

    const mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        roles: [UserRole.CLIENT]
      }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
  });
}); 