import { env } from "@/shared/config/env";
import { Http } from "@/shared/http";



export class Coingecko extends Http {
  private static instance: Coingecko;

  public static getInstance(): Coingecko {
    if (!Coingecko.instance) {
      Coingecko.instance = Coingecko.make()
    }
    return Coingecko.instance
  }

  private static getAuthMap(environment: string): Record<string, string> {
    if (!env.coingecko_base_url) {
      throw new Error('COINGECKO_BASE_URL is not defined')
    }
    if (!env.coingecko_api_key) {
      throw new Error('COINGECKO_API_KEY is not defined')
    }

    const authMap = {
      development: {
        'x-cg-api-key': env.coingecko_api_key
      },
      production: {
        'x-cg-pro-api-key': env.coingecko_api_key
      },
    }
    const auth = authMap[environment as keyof typeof authMap]
    if (!auth) {
      throw new Error('Invalid coingecko environment')
    }
    return auth
  }

  private static make(): Http {
    const request = new Http()
    request.url = env.coingecko_base_url
    request.withHeaders(Coingecko.getAuthMap(env.node_env))
    return request
  }
}