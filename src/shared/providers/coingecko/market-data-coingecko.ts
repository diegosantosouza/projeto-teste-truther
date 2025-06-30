import { Coin } from "@/modules/coins/entities";
import { BaseModel } from "@/shared/models/base-model";
import { Coingecko } from "./coingecko-provider";
import { CoinMarketData } from "./interface";
import { MarketDataInterface } from "@/shared/providers/interfaces";
import { marketDataToCoin } from "../adapter";

export class MarketDataCoingecko implements MarketDataInterface {
  async get(coinId: string, currency: string = 'usd'): Promise<Omit<Coin, keyof BaseModel> | null> {
    const response = await Coingecko.getInstance().get(`/coins/markets?vs_currency=${currency}&ids=${coinId}&price_change_percentage=7d`);
    if (response.status() !== 200) {
      return null;
    }

    const data = response.json() as CoinMarketData[];
    if (!data || data.length === 0) {
      return null;
    }

    return marketDataToCoin(data[0]);
  }
}