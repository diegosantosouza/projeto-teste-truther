import { z } from 'zod'
import { CoinsNameEnum } from '@/modules/coins/entities'

export const CoinIdSchema = z.object({
  coinId: z.nativeEnum(CoinsNameEnum),
})

export type CoinIdInput = z.infer<typeof CoinIdSchema>