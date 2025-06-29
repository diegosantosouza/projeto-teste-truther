import { UserListHttpController } from '@/modules/user/controllers/user-list-http-controller';
import { UserListUseCase } from '@/modules/user/usecases/user-list-usecase';
import { UserFactory } from '../__mocks__/user-factory';
import { UserRole } from '@/modules/user/entities/user';
import { Request } from 'express';

describe('UserListHttpController', () => {
  let controller: UserListHttpController;
  let mockUseCase: jest.Mocked<UserListUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new UserListHttpController(mockUseCase);
  });

  it('should return empty array when no users exist', async () => {
    mockUseCase.execute.mockResolvedValue([]);

    const mockRequest = {
      query: {}
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({});
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([]);
  });

  it('should return all users when no filters applied', async () => {
    const mockUsers = UserFactory.createUserList(3);
    mockUseCase.execute.mockResolvedValue(mockUsers);

    const mockRequest = {
      query: {}
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({});
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUsers);
  });

  it('should apply name filter', async () => {
    const mockUsers = UserFactory.createUserList(1);
    mockUseCase.execute.mockResolvedValue(mockUsers);

    const mockRequest = {
      query: { name: 'John' }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ name: 'John' });
    expect(result.statusCode).toBe(200);
  });

  it('should apply email filter', async () => {
    const mockUsers = UserFactory.createUserList(1);
    mockUseCase.execute.mockResolvedValue(mockUsers);

    const mockRequest = {
      query: { email: 'john@example.com' }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(result.statusCode).toBe(200);
  });

  it('should apply role filter', async () => {
    const mockUsers = UserFactory.createUserList(1);
    mockUseCase.execute.mockResolvedValue(mockUsers);

    const mockRequest = {
      query: { roles: UserRole.ADMIN }
    } as unknown as Request;

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ roles: UserRole.ADMIN });
    expect(result.statusCode).toBe(200);
  });

  it('should propagate use case errors', async () => {
    const error = new Error('Use case error');
    mockUseCase.execute.mockRejectedValue(error);

    const mockRequest = {
      query: {}
    } as unknown as Request;

    await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
  });
}); 