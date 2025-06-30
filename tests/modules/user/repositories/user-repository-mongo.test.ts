import mongoose from 'mongoose';
import { UserRepository } from '@/modules/user/repositories/user-repository-mongo';
import { UserSchema } from '@/modules/user/schemas';
import { UserFactory } from '../__mocks__/user-factory';
import { UserRole } from '@/modules/user/entities/user';
import { UserListInput, UserUpdateInput } from '@/modules/user/dto';

jest.mock('mongoose');
jest.mock('@/modules/user/schemas', () => ({
  UserSchema: {
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  }
}));

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUserSchema: jest.Mocked<typeof UserSchema>;

  beforeEach(() => {
    repository = new UserRepository();
    mockUserSchema = UserSchema as jest.Mocked<typeof UserSchema>;
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should find users without filters', async () => {
      const mockUsers = UserFactory.createUserList(3);
      const mockDocs = mockUsers.map(user => ({
        toJSON: jest.fn().mockReturnValue(user)
      }));

      mockUserSchema.find.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDocs)
      } as any);

      await repository.find({});

      expect(mockUserSchema.find).toHaveBeenCalledWith({});
    });

    it('should find users with name filter', async () => {
      const mockUsers = UserFactory.createUserList(2);
      const mockDocs = mockUsers.map(user => ({
        toJSON: jest.fn().mockReturnValue(user)
      }));

      mockUserSchema.find.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDocs)
      } as any);

      const input: UserListInput = { name: 'John' };
      await repository.find(input);

      expect(mockUserSchema.find).toHaveBeenCalledWith({
        name: { $regex: 'John', $options: 'i' }
      });
    });

    it('should find users with email filter', async () => {
      const mockUsers = UserFactory.createUserList(2);
      const mockDocs = mockUsers.map(user => ({
        toJSON: jest.fn().mockReturnValue(user)
      }));

      mockUserSchema.find.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDocs)
      } as any);

      const input: UserListInput = { email: 'test@example.com' };
      await repository.find(input);

      expect(mockUserSchema.find).toHaveBeenCalledWith({
        email: { $regex: 'test@example.com', $options: 'i' }
      });
    });

    it('should find users with roles filter', async () => {
      const mockUsers = UserFactory.createUserList(2);
      const mockDocs = mockUsers.map(user => ({
        toJSON: jest.fn().mockReturnValue(user)
      }));

      mockUserSchema.find.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDocs)
      } as any);

      const input: UserListInput = { roles: UserRole.ADMIN };
      await repository.find(input);

      expect(mockUserSchema.find).toHaveBeenCalledWith({
        roles: { $in: [UserRole.ADMIN] }
      });
    });

    it('should find users with multiple filters', async () => {
      const mockUsers = UserFactory.createUserList(1);
      const mockDocs = mockUsers.map(user => ({
        toJSON: jest.fn().mockReturnValue(user)
      }));

      mockUserSchema.find.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDocs)
      } as any);

      const input: UserListInput = {
        name: 'John',
        email: 'john@example.com',
        roles: UserRole.CLIENT
      };
      await repository.find(input);

      expect(mockUserSchema.find).toHaveBeenCalledWith({
        name: { $regex: 'John', $options: 'i' },
        email: { $regex: 'john@example.com', $options: 'i' },
        roles: { $in: [UserRole.CLIENT] }
      });
    });
  });

  describe('update', () => {
    it('should update user without roles', async () => {
      const mockUser = UserFactory.createUser();
      const mockDoc = {
        toJSON: jest.fn().mockReturnValue(mockUser)
      };

      mockUserSchema.findByIdAndUpdate.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDoc)
      } as any);

      const updateData: UserUpdateInput = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      await repository.update('1', updateData);

      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
    });

    it('should update user with roles and ensure uniqueness', async () => {
      const mockUser = UserFactory.createUser();
      const mockDoc = {
        toJSON: jest.fn().mockReturnValue(mockUser)
      };

      mockUserSchema.findByIdAndUpdate.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDoc)
      } as any);

      const updateData: UserUpdateInput = {
        roles: [UserRole.ADMIN, UserRole.CLIENT, UserRole.ADMIN] // Duplicado intencionalmente
      };

      await repository.update('1', updateData);

      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith('1', {
        roles: [UserRole.ADMIN, UserRole.CLIENT]
      }, { new: true });
    });

    it('should update user with single role', async () => {
      const mockUser = UserFactory.createUser();
      const mockDoc = {
        toJSON: jest.fn().mockReturnValue(mockUser)
      };

      mockUserSchema.findByIdAndUpdate.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDoc)
      } as any);

      const updateData: UserUpdateInput = {
        roles: [UserRole.ADMIN]
      };

      await repository.update('1', updateData);

      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith('1', {
        roles: [UserRole.ADMIN]
      }, { new: true });
    });

    it('should return null when user not found', async () => {
      mockUserSchema.findByIdAndUpdate.mockReturnValue({
        then: jest.fn().mockResolvedValue(null)
      } as any);

      const updateData: UserUpdateInput = {
        name: 'Updated Name'
      };

      const result = await repository.update('999', updateData);

      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith('999', updateData, { new: true });
      expect(result).toBeNull();
    });

    it('should handle update with empty roles array', async () => {
      const mockUser = UserFactory.createUser();
      const mockDoc = {
        toJSON: jest.fn().mockReturnValue(mockUser)
      };

      mockUserSchema.findByIdAndUpdate.mockReturnValue({
        then: jest.fn().mockResolvedValue(mockDoc)
      } as any);

      const updateData: UserUpdateInput = {
        roles: []
      };

      await repository.update('1', updateData);

      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith('1', {
        roles: []
      }, { new: true });
    });
  });
}); 