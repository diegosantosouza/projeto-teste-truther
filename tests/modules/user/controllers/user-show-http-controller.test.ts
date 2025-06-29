import { UserShowHttpController } from '@/modules/user/controllers/user-show-http-controller';
import { UserShowUseCase } from '@/modules/user/usecases/user-show-usecase';
import { UserFactory } from '../__mocks__/user-factory';
import { Request } from 'express';

describe('UserShowHttpController', () => {
  let controller: UserShowHttpController;
  let mockUseCase: jest.Mocked<UserShowUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new UserShowHttpController(mockUseCase);
  });

  it('should return user when valid id is provided', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockUseCase.execute.mockResolvedValue(mockUser);

    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439011' });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUser);
  });

  it('should validate id parameter', async () => {
    const mockRequest = {
      params: { id: 'invalid-id' }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow();
  });

  it('should propagate use case errors', async () => {
    const error = new Error('Use case error');
    mockUseCase.execute.mockRejectedValue(error);

    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' }
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
  });
}); 