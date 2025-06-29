import { Request } from 'express';
import { UserDeleteUseCase } from '@/modules/user/usecases';
import { HttpResponse } from '@/shared/protocols/http';
import { noContent } from '@/shared/helpers';
import { UserIdSchema } from '@/modules/user/dto';

export class UserDeleteHttpController {
  constructor(private readonly userDeleteUseCase: UserDeleteUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const idParsed = UserIdSchema.parse(req.params);
    await this.userDeleteUseCase.execute(idParsed);
    return noContent();
  }
}