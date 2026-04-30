import pLimit from 'p-limit'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Research } from '@/types/research'
import { notionClient, AI_DB_ID, EXPERT_DB_ID } from './client'
import { mapAiPageToResearch, mapExpertPageToResearch } from './mappers'
import { NOTION_PROPERTIES, STATUS } from './constants'

/** Notion API 동시 요청 수 제한 (Rate Limit: 평균 3 req/s) */
const limit = pLimit(3)

/** Notion data source에서 published 상태 페이지 전체 조회 (cursor 페이지네이션) */
async function fetchAllPages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    // @notionhq/client v5: databases.query → dataSources.query, database_id → data_source_id
    const response = await notionClient.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: NOTION_PROPERTIES.STATUS,
        select: { equals: STATUS.PUBLISHED },
      },
      sorts: [{ property: NOTION_PROPERTIES.PUBLISHED_AT, direction: 'descending' }],
      start_cursor: cursor,
      page_size: 100,
    })

    const validPages = response.results.filter(
      (p): p is PageObjectResponse => p.object === 'page' && 'properties' in p
    )
    pages.push(...validPages)
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return pages
}

/**
 * source별 리서치 목록 조회
 * @param source 'ai' | 'expert' — 미지정 시 AI DB 조회
 */
export async function listResearches(source: 'ai' | 'expert' = 'ai'): Promise<Research[]> {
  const dataSourceId = source === 'expert' ? EXPERT_DB_ID : AI_DB_ID
  if (!dataSourceId) return []

  try {
    const pages = await fetchAllPages(dataSourceId)
    const mapper = source === 'expert' ? mapExpertPageToResearch : mapAiPageToResearch
    return await Promise.all(pages.map((page) => limit(() => Promise.resolve(mapper(page)))))
  } catch (error) {
    console.error(`[Notion] listResearches(${source}) 실패:`, error)
    return []
  }
}

/**
 * AI + Expert 통합 리서치 목록 조회 (검색 페이지용)
 * publishedAt 내림차순으로 병합 정렬
 */
export async function getAllResearches(): Promise<Research[]> {
  const [aiList, expertList] = await Promise.all([
    listResearches('ai'),
    listResearches('expert'),
  ])

  return [...aiList, ...expertList].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )
}

/**
 * ID로 단일 리서치 조회
 * AI_MODEL 필드 존재 여부로 AI/Expert DB 구분
 * @returns Research 또는 null (존재하지 않거나 미발행)
 */
export async function getResearchById(id: string): Promise<Research | null> {
  try {
    const page = await notionClient.pages.retrieve({ page_id: id })
    if (page.object !== 'page' || !('properties' in page)) return null

    const typedPage = page as PageObjectResponse
    const statusProp = typedPage.properties[NOTION_PROPERTIES.STATUS]
    if (statusProp?.type === 'select' && statusProp.select?.name !== STATUS.PUBLISHED) return null

    // AI_MODEL 필드 값이 있으면 AI DB, 없으면 Expert DB로 판단
    const aiModelProp = typedPage.properties[NOTION_PROPERTIES.AI_MODEL]
    const isAi =
      aiModelProp?.type === 'rich_text' &&
      aiModelProp.rich_text.length > 0

    return isAi
      ? mapAiPageToResearch(typedPage)
      : mapExpertPageToResearch(typedPage)
  } catch (error) {
    console.error(`[Notion] getResearchById(${id}) 실패:`, error)
    return null
  }
}

/**
 * ticker 기준 AI + Expert 통합 리서치 목록 조회 (히스토리 페이지용)
 * @returns publishedAt 오름차순 정렬 배열
 */
export async function listResearchesByTicker(ticker: string): Promise<Research[]> {
  async function queryDb(dataSourceId: string, source: 'ai' | 'expert'): Promise<Research[]> {
    if (!dataSourceId) return []
    try {
      const response = await notionClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          and: [
            { property: NOTION_PROPERTIES.STATUS, select: { equals: STATUS.PUBLISHED } },
            { property: NOTION_PROPERTIES.TICKER, rich_text: { equals: ticker } },
          ],
        },
        sorts: [{ property: NOTION_PROPERTIES.PUBLISHED_AT, direction: 'ascending' }],
      })
      const pages = response.results.filter(
        (p): p is PageObjectResponse => p.object === 'page' && 'properties' in p
      )
      const mapper = source === 'expert' ? mapExpertPageToResearch : mapAiPageToResearch
      return pages.map(mapper)
    } catch (error) {
      console.error(`[Notion] listResearchesByTicker(${ticker}, ${source}) 실패:`, error)
      return []
    }
  }

  const [aiList, expertList] = await Promise.all([
    limit(() => queryDb(AI_DB_ID, 'ai')),
    limit(() => queryDb(EXPERT_DB_ID, 'expert')),
  ])

  return [...aiList, ...expertList].sort(
    (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime()
  )
}
