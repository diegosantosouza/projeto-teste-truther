import { Request } from 'express';
import { UserListUseCase } from '@/modules/user/usecases';
import { HttpResponse } from '@/shared/protocols/http';
import { ok } from '@/shared/helpers';
import { UserListInputSchema } from '@/modules/user/dto';

export class UserListHttpController {
  constructor(private readonly userListUseCase: UserListUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const parsed = UserListInputSchema.parse(req.query);
    const users = await this.userListUseCase.execute(parsed);
    return ok(users);
  }
}
