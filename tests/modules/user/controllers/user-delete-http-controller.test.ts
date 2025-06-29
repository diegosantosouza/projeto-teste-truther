import { UserDeleteHttpController } from '@/modules/user/controllers/user-delete-http-controller';
import { UserDeleteUseCase } from '@/modules/user/usecases/user-delete-usecase';
import { Request } from 'express';

describe('UserDeleteHttpController', () => {
  let controller: UserDeleteHttpController;
  let mockUseCase: jest.Mocked<UserDeleteUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new UserDeleteHttpController(mockUseCase);
  });

  it('should delete user successfully', async () => {
    mockUseCase.execute.mockResolvedValue(true);

    const mockRequest = {
      params: { id: '507f1f77bcf86cd799439011' }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439011' });
    expect(result.statusCode).toBe(204);
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