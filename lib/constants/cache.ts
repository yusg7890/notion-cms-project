export const CACHE_TAGS = {
  RESEARCH_LIST: 'research-list',
  researchDetail: (id: string) => `research:${id}`,
  stockHistory: (ticker: string) => `stock:${ticker}`,
} as const
