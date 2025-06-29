import bcrypt from 'bcrypt';
import { PasswordService } from '../../../../src/modules/user/services/password-service';

jest.mock('bcrypt');

describe('PasswordService', () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash password with correct salt rounds', async () => {
      const password = 'testPassword123';
      const expectedHash = 'hashedPassword123';

      (mockBcrypt.hash as jest.Mock).mockResolvedValue(expectedHash);

      const result = await PasswordService.hash(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(expectedHash);
    });

    it('should handle empty password', async () => {
      const password = '';
      const expectedHash = 'emptyHash';

      (mockBcrypt.hash as jest.Mock).mockResolvedValue(expectedHash);

      const result = await PasswordService.hash(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(expectedHash);
    });

    it('should handle bcrypt error', async () => {
      const password = 'testPassword123';
      const error = new Error('Bcrypt error');

      (mockBcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(PasswordService.hash(password)).rejects.toThrow('Bcrypt error');
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and hash', async () => {
      const plainPassword = 'testPassword123';
      const hash = 'hashedPassword123';

      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await PasswordService.compare(plainPassword, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const plainPassword = 'testPassword123';
      const hash = 'hashedPassword123';

      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await PasswordService.compare(plainPassword, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      const plainPassword = '';
      const hash = 'hashedPassword123';

      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await PasswordService.compare(plainPassword, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
      expect(result).toBe(false);
    });

    it('should handle bcrypt compare error', async () => {
      const plainPassword = 'testPassword123';
      const hash = 'hashedPassword123';
      const error = new Error('Bcrypt compare error');

      (mockBcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(PasswordService.compare(plainPassword, hash)).rejects.toThrow('Bcrypt compare error');
      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, hash);
    });
  });
}); 