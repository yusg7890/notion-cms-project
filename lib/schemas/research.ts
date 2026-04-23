import { z } from 'zod'

export const ResearchSchema = z.object({
  id: z.string(),
  title: z.string(),
  stockName: z.string(),
  ticker: z.string(),
  sector: z.string(),
  tags: z.array(z.string()),
  opinion: z.enum(['BUY', 'HOLD', 'SELL']),
  targetPrice: z.number(),
  currency: z.enum(['KRW', 'USD']),
  summary: z.string(),
  publishedAt: z.date(),
  status: z.enum(['draft', 'published']),
  aiModel: z.string(),
})

export type ResearchFromSchema = z.infer<typeof ResearchSchema>
