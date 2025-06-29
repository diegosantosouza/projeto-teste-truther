import { BaseModel } from '@/shared/models/base-model';

export type User = BaseModel & {
  name: string;
  email: string;
  password: string;
  roles: Array<UserRole>;
};

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}
