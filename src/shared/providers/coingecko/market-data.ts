import { Coingecko } from "./coingecko-provider";
import { CoinMarketData } from "./interface";

export class MarketData {
  static async get(coinId: string, currency: string = 'usd'): Promise<CoinMarketData | null> {
    const response = await Coingecko.getInstance().get(`/coins/markets?vs_currency=${currency}&ids=${coinId}&price_change_percentage=7d`);
    if (response.status() !== 200) {
      return null;
    }

    const data = response.json() as CoinMarketData[];
    if (!data || data.length === 0) {
      return null;
    }

    return data[0] as CoinMarketData;
  }
}