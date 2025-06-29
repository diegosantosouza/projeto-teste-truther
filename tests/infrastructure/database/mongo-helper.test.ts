import mongoose from 'mongoose';
import { MongoHelper } from '../../../src/infrastructure/database/mongo-helper';

jest.mock('mongoose');

describe('MongoHelper', () => {
  const mockMongoose = mongoose as jest.Mocked<typeof mongoose>;
  const mockConnection = {
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
    (MongoHelper as any).connection = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('connect', () => {
    it('should connect to MongoDB successfully', async () => {
      const uri = 'mongodb://localhost:27017/test';
      const debug = false;

      mockMongoose.connect.mockResolvedValue(mockConnection as any);

      await MongoHelper.connect(uri, debug);

      expect(mockMongoose.set).toHaveBeenCalledWith('debug', debug);
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri);
      expect(console.log).toHaveBeenCalledWith('MongoDb connected successfully');
    });

    it('should connect with debug enabled', async () => {
      const uri = 'mongodb://localhost:27017/test';
      const debug = true;

      mockMongoose.connect.mockResolvedValue(mockConnection as any);

      await MongoHelper.connect(uri, debug);

      expect(mockMongoose.set).toHaveBeenCalledWith('debug', debug);
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri);
    });

    it('should not connect if already connected', async () => {
      const uri = 'mongodb://localhost:27017/test';

      mockMongoose.connect.mockResolvedValue(mockConnection as any);

      await MongoHelper.connect(uri);
      await MongoHelper.connect(uri);

      expect(mockMongoose.connect).toHaveBeenCalledTimes(1);
    });

    it('should handle connection error', async () => {
      const uri = 'mongodb://localhost:27017/test';
      const error = new Error('Connection failed');

      mockMongoose.connect.mockRejectedValue(error);

      await expect(MongoHelper.connect(uri)).rejects.toThrow('Connection failed');
      expect(console.error).toHaveBeenCalledWith('MongoDb connection Error', error);
    });

    it('should use default debug value when not provided', async () => {
      const uri = 'mongodb://localhost:27017/test';

      mockMongoose.connect.mockResolvedValue(mockConnection as any);

      await MongoHelper.connect(uri);

      expect(mockMongoose.set).toHaveBeenCalledWith('debug', false);
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully when connected', async () => {
      const uri = 'mongodb://localhost:27017/test';

      mockMongoose.connect.mockResolvedValue(mockConnection as any);
      mockConnection.disconnect.mockResolvedValue(undefined);

      await MongoHelper.connect(uri);
      await MongoHelper.disconnect();

      expect(mockConnection.disconnect).toHaveBeenCalled();
      expect(console.debug).toHaveBeenCalledWith('MongoDb disconnected');
    });

    it('should not disconnect if not connected', async () => {
      await MongoHelper.disconnect();

      expect(mockConnection.disconnect).not.toHaveBeenCalled();
    });

    it('should handle disconnect error', async () => {
      const uri = 'mongodb://localhost:27017/test';
      const error = new Error('Disconnect failed');

      mockMongoose.connect.mockResolvedValue(mockConnection as any);
      mockConnection.disconnect.mockRejectedValue(error);

      await MongoHelper.connect(uri);
      await expect(MongoHelper.disconnect()).rejects.toThrow('Disconnect failed');
      expect(console.error).toHaveBeenCalledWith('MongoDb disconnect Error', error);
    });

    it('should handle disconnect when connection is null', async () => {
      await MongoHelper.disconnect();

      expect(mockConnection.disconnect).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });
  });
}); 