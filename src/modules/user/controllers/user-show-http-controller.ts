import { Request } from 'express';
import { HttpResponse } from '@/shared/protocols/http';
import { ok } from '@/shared/helpers';
import { UserShowUseCase } from '@/modules/user/usecases';
import { UserIdSchema } from '@/modules/user/dto';

export class UserShowHttpController {
  constructor(private readonly userShowUseCase: UserShowUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const parsed = UserIdSchema.parse(req.params);
    const user = await this.userShowUseCase.execute(parsed);
    return ok(user);
  }
}
