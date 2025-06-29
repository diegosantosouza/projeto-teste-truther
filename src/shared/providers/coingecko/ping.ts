import { Coingecko } from "./coingecko-provider";

export class CoingeckoPing {
  public static async execute(): Promise<unknown> {
    const coingecko = Coingecko.getInstance();
    const response = await coingecko.get('/ping');
    return response.json();
  }
}