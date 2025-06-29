import { CoinMarketData } from "@/shared/providers/coingecko/interface";
import { Coin, CoinsNameEnum } from "@/modules/coins/entities";
import { BaseModel } from "@/shared/models/base-model";

export function marketDataToCoin(marketData: CoinMarketData): Omit<Coin, keyof BaseModel> {
  return {
    coinId: marketData.id as CoinsNameEnum,
    name: marketData.name,
    marketCap: marketData.market_cap,
    priceChangePercentage24h: marketData.price_change_percentage_24h,
    priceChangePercentage7d: marketData.price_change_percentage_7d_in_currency,
    lowestPrice: marketData.atl,
    highestPrice: marketData.ath,
    currentPrice: marketData.current_price,
  };
}