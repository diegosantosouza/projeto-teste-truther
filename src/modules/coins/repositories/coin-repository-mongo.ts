import { BaseRepository } from '@/shared/repository/repository';
import { BaseModel } from '@/shared/models/base-model';
import { CoinInterface, CoinSchema } from '@/modules/coins/schemas';
import { Coin } from '@/modules/coins/entities';

export class CoinRepository extends BaseRepository<CoinInterface, Omit<Coin, keyof BaseModel>> {
  constructor() {
    super(CoinSchema);
  }
}
