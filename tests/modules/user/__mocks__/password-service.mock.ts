export class MockPasswordService {
  static hash(password: string): Promise<string> {
    return Promise.resolve(`hashed-${password}`);
  }

  static compare(plain: string, hash: string): Promise<boolean> {
    return Promise.resolve(hash === `hashed-${plain}`);
  }
} 