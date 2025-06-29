import { UserUpdateHttpController } from '@/modules/user/controllers/user-update-http-controller';
import { UserUpdateUseCase } from '@/modules/user/usecases/user-update-usecase';
import { UserFactory } from '../__mocks__/user-factory';
import { UserRole } from '@/modules/user/entities/user';
import { Request } from 'express';

describe('UserUpdateHttpController', () => {
  let controller: UserUpdateHttpController;
  let mockUseCase: jest.Mocked<UserUpdateUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new UserUpdateHttpController(mockUseCase);
  });

  it('should update user successfully', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011', name: 'Updated Name' });
    mockUseCase.execute.mockResolvedValue(mockUser);

    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: {
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      id: '507f1f77bcf86cd799439011',
      name: 'Updated Name',
      email: 'updated@example.com'
    });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUser);
  });

  it('should validate id parameter', async () => {
    const mockRequest = {
      params: { id: 'invalid-id' },
      body: { name: 'Updated Name' }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow();
  });

  it('should validate body data', async () => {
    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: {
        name: 'Jo',
        email: 'invalid-email'
      }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow();
  });

  it('should propagate use case errors', async () => {
    const error = new Error('Use case error');
    mockUseCase.execute.mockRejectedValue(error);

    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { name: 'Updated Name' }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
  });
}); 