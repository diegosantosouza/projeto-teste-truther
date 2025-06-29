import { Request } from 'express';
import { HttpResponse } from '@/shared/protocols/http';
import { ok } from '@/shared/helpers';
import { CoinIdSchema } from '@/modules/coins/dto';
import { CoinShowUseCase } from '@/modules/coins/usecases';

export class CoinShowHttpController {
  constructor(private readonly coinShowUseCase: CoinShowUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const parsed = CoinIdSchema.parse(req.params);
    const coin = await this.coinShowUseCase.execute(parsed);
    return ok(coin);
  }
}
