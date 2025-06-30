import { Coin } from "@/modules/coins/entities";
import { BaseModel } from "@/shared/models/base-model";

export interface MarketDataInterface {
  get(coinId: string, currency?: string): Promise<Omit<Coin, keyof BaseModel> | null>;
}