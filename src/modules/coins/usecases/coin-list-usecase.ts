import { CoinRepository } from '@/modules/coins/repositories';
import { CoinListOutput } from '@/modules/coins/dto';

export class CoinListUseCase {
  constructor(private readonly coinRepository: CoinRepository) { }

  async execute(): Promise<CoinListUseCase.Output> {
    const coins = await this.coinRepository.find({});
    return coins;
  }
}

export namespace CoinListUseCase {
  export type Output = CoinListOutput;
}
