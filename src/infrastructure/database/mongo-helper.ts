import mongoose, { Mongoose } from 'mongoose';

export class MongoHelper {
  private static connection: Mongoose | null = null;

  static async connect(uri: string, debug: boolean = false): Promise<void> {
    if (!this.connection) {
      try {
        mongoose.set('debug', debug);
        this.connection = await mongoose.connect(uri);
        console.log('MongoDb connected successfully');
      } catch (error) {
        console.error('MongoDb connection Error', error);
        throw error;
      }
    }
  }

  static async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.disconnect();
        console.debug('MongoDb disconnected');
      } catch (error) {
        console.error('MongoDb disconnect Error', error);
        throw error;
      }
    }
  }
}
