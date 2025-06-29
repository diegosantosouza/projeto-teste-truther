import { BaseRepository } from '../../../src/shared/repository/repository';
import { Model } from 'mongoose';

describe('BaseRepository', () => {
  let mockModel: jest.Mocked<Model<any>>;
  let repository: BaseRepository<any, any>;

  beforeEach(() => {
    mockModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findOneAndUpdate: jest.fn(),
    } as any;
    repository = new BaseRepository(mockModel);
  });

  describe('create', () => {
    it('should create and return document as JSON', async () => {
      const data = { name: 'test' };
      const mockDoc = { toJSON: () => ({ id: '1', ...data }) };
      mockModel.create.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.create(data);
      expect(mockModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: '1', ...data });
    });
  });

  describe('findOne', () => {
    it('should find one document and return as JSON', async () => {
      const filter = { name: 'test' };
      const mockDoc = { toJSON: () => ({ id: '1', name: 'test' }) };
      mockModel.findOne.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.findOne(filter);
      expect(mockModel.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual({ id: '1', name: 'test' });
    });

    it('should return null when document not found', async () => {
      const filter = { name: 'nonexistent' };
      mockModel.findOne.mockReturnValue({ then: (fn: any) => fn(null) } as any);

      const result = await repository.findOne(filter);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find document by id and return as JSON', async () => {
      const id = '123';
      const mockDoc = { toJSON: () => ({ id, name: 'test' }) };
      mockModel.findById.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.findById(id);
      expect(mockModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id, name: 'test' });
    });

    it('should return null when document not found by id', async () => {
      const id = 'nonexistent';
      mockModel.findById.mockReturnValue({ then: (fn: any) => fn(null) } as any);

      const result = await repository.findById(id);
      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should find documents and return as JSON array', async () => {
      const filter = { active: true };
      const mockDocs = [
        { toJSON: () => ({ id: '1', name: 'test1' }) },
        { toJSON: () => ({ id: '2', name: 'test2' }) },
      ];
      mockModel.find.mockReturnValue({ then: (fn: any) => fn(mockDocs) } as any);

      const result = await repository.find(filter);
      expect(mockModel.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual([
        { id: '1', name: 'test1' },
        { id: '2', name: 'test2' },
      ]);
    });

    it('should return empty array when no documents found', async () => {
      const filter = { active: false };
      mockModel.find.mockReturnValue({ then: (fn: any) => fn([]) } as any);

      const result = await repository.find(filter);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update document and return as JSON', async () => {
      const id = '123';
      const data = { name: 'updated' };
      const mockDoc = { toJSON: () => ({ id, ...data }) };
      mockModel.findByIdAndUpdate.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.update(id, data);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
      expect(result).toEqual({ id, ...data });
    });

    it('should return null when document not found for update', async () => {
      const id = 'nonexistent';
      const data = { name: 'updated' };
      mockModel.findByIdAndUpdate.mockReturnValue({ then: (fn: any) => fn(null) } as any);

      const result = await repository.update(id, data);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete document and return true', async () => {
      const id = '123';
      const mockDoc = { id, name: 'test' };
      mockModel.findByIdAndDelete.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.delete(id);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });

    it('should return false when document not found for deletion', async () => {
      const id = 'nonexistent';
      mockModel.findByIdAndDelete.mockReturnValue({ then: (fn: any) => fn(null) } as any);

      const result = await repository.delete(id);
      expect(result).toBe(false);
    });
  });

  describe('upsert', () => {
    it('should upsert document and return as JSON', async () => {
      const filter = { email: 'test@example.com' };
      const data = { name: 'test' };
      const mockDoc = { toJSON: () => ({ id: '1', email: 'test@example.com', ...data }) };
      mockModel.findOneAndUpdate.mockReturnValue({ then: (fn: any) => fn(mockDoc) } as any);

      const result = await repository.upsert(filter, data);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        filter,
        { $set: data },
        { new: true, upsert: true }
      );
      expect(result).toEqual({ id: '1', email: 'test@example.com', ...data });
    });

    it('should return null when upsert fails', async () => {
      const filter = { email: 'test@example.com' };
      const data = { name: 'test' };
      mockModel.findOneAndUpdate.mockReturnValue({ then: (fn: any) => fn(null) } as any);

      const result = await repository.upsert(filter, data);
      expect(result).toBeNull();
    });
  });
}); 