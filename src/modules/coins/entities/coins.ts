import { BaseModel } from '@/shared/models/base-model';
import { CoinsNameEnum } from './coins-name-enum';

export type Coin = BaseModel & {
  coinId: CoinsNameEnum;
  name: string;
  marketCap: number;
  priceChangePercentage24h?: number;
  priceChangePercentage7d?: number;
  lowestPrice?: number;
  highestPrice?: number;
  currentPrice: number;
};
