import { Request } from 'express';
import { UserCreateInputSchema } from '@/modules/user/dto/user-create-dto';
import { UserCreateUseCase } from '@/modules/user/usecases';
import { HttpResponse } from '@/shared/protocols/http';
import { created } from '@/shared/helpers';

export class UserCreateHttpController {
  constructor(private readonly userCreateUseCase: UserCreateUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const parsed = UserCreateInputSchema.parse(req.body);
    const user = await this.userCreateUseCase.execute(parsed);
    return created(user);
  }
}
