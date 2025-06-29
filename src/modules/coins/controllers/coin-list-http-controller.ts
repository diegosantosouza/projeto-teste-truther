import { Request } from 'express';
import { HttpResponse } from '@/shared/protocols/http';
import { ok } from '@/shared/helpers';
import { CoinListUseCase } from '@/modules/coins/usecases';

export class CoinListHttpController {
  constructor(private readonly coinListUseCase: CoinListUseCase) { }

  async handle(req: Request): Promise<HttpResponse> {
    const coins = await this.coinListUseCase.execute();
    return ok(coins);
  }
}
