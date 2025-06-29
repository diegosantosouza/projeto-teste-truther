import { Request } from 'express';
import { UserUpdateUseCase } from '@/modules/user/usecases';
import { HttpResponse } from '@/shared/protocols/http';
import { ok } from '@/shared/helpers';
import { UserUpdateInputSchema, UserIdSchema } from '@/modules/user/dto';

export class UserUpdateHttpController {
  constructor(private readonly userUpdateUseCase: UserUpdateUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const idParsed = UserIdSchema.parse(req.params);
    const parsed = UserUpdateInputSchema.parse(req.body);
    const user = await this.userUpdateUseCase.execute({ ...parsed, id: idParsed.id });
    return ok(user);
  }
}
