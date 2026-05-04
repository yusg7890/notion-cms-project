import { z } from 'zod'

export const ResearchSchema = z.object({
  id: z.string(),
  title: z.string(),
  stockName: z.string(),
  ticker: z.string(),
  sector: z.string(),
  tags: z.array(z.string()),
  opinion: z.enum(['BUY', 'HOLD', 'SELL']),
  /** AI DB 전용 — Expert는 undefined */
  targetPrice: z.number().optional(),
  /** Expert DB 전용 — AI는 undefined */
  expertBuyPrice: z.number().optional(),
  currency: z.enum(['KRW', 'USD']),
  summary: z.string(),
  publishedAt: z.date(),
  status: z.enum(['draft', 'published']),
  aiModel: z.string(),
  source: z.enum(['ai', 'expert']),
})

export type ResearchFromSchema = z.infer<typeof ResearchSchema>
