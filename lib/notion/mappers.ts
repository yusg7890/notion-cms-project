import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Research } from '@/types/research'
import { NOTION_PROPERTIES, OPINION_MAP, type OpinionLabel } from './constants'

type Props = PageObjectResponse['properties']

/** Rich Text 배열에서 plain_text 추출 (앞뒤 공백 제거) */
function getRichText(props: Props, key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'rich_text') return ''
  return prop.rich_text.map((t) => t.plain_text).join('').trim()
}

/** Title 속성에서 plain_text 추출 (앞뒤 공백 제거) */
function getTitle(props: Props, key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'title') return ''
  return prop.title.map((t) => t.plain_text).join('').trim()
}

/** Select 속성값 추출 */
function getSelect(props: Props, key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'select' || !prop.select) return ''
  return prop.select.name
}

/** Notion 기본 Status 속성값 추출 */
function getStatus(props: Props, key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'status' || !prop.status) return ''
  return prop.status.name
}

/** Multi-select 속성값 배열 추출 */
function getMultiSelect(props: Props, key: string): string[] {
  const prop = props[key]
  if (!prop || prop.type !== 'multi_select') return []
  return prop.multi_select.map((s) => s.name)
}

/** Number 속성값 추출 — Notion 컬럼 타입이 Number 또는 rich_text(숫자 문자열) 모두 지원 */
function getNumber(props: Props, key: string): number | undefined {
  const prop = props[key]
  if (!prop) return undefined
  if (prop.type === 'number') {
    return prop.number ?? undefined
  }
  // Notion DB에서 rich_text로 생성된 경우 파싱
  if (prop.type === 'rich_text') {
    const text = prop.rich_text.map((t) => t.plain_text).join('').trim()
    const parsed = parseFloat(text.replace(/,/g, ''))
    return isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

/** Date 속성값을 Date 객체로 추출 */
function getDate(props: Props, key: string): Date {
  const prop = props[key]
  if (!prop || prop.type !== 'date' || !prop.date) return new Date()
  return new Date(prop.date.start)
}

/** opinion Select 값(한글)을 BUY/HOLD/SELL 코드로 변환 */
function parseOpinion(label: string): Research['opinion'] {
  return OPINION_MAP[label as OpinionLabel] ?? 'HOLD'
}

/** currency Select 값을 KRW/USD로 변환 */
function parseCurrency(value: string): Research['currency'] {
  return value === 'USD' ? 'USD' : 'KRW'
}

/** AI DB Notion 페이지 → Research 타입 변환 (source: 'ai' 고정) */
export function mapAiPageToResearch(page: PageObjectResponse): Research {
  const props = page.properties
  return {
    id: page.id,
    title: getTitle(props, NOTION_PROPERTIES.TITLE),
    stockName: getRichText(props, NOTION_PROPERTIES.STOCK_NAME),
    ticker: getRichText(props, NOTION_PROPERTIES.TICKER),
    sector: getSelect(props, NOTION_PROPERTIES.SECTOR),
    tags: getMultiSelect(props, NOTION_PROPERTIES.TAGS),
    opinion: parseOpinion(getSelect(props, NOTION_PROPERTIES.OPINION)),
    targetPrice: getNumber(props, NOTION_PROPERTIES.TARGET_PRICE),
    expertBuyPrice: undefined,
    currency: parseCurrency(getSelect(props, NOTION_PROPERTIES.CURRENCY)),
    summary: getRichText(props, NOTION_PROPERTIES.SUMMARY),
    publishedAt: getDate(props, NOTION_PROPERTIES.PUBLISHED_AT),
    status: (getStatus(props, NOTION_PROPERTIES.STATUS) as Research['status']) || 'draft',
    aiModel: getRichText(props, NOTION_PROPERTIES.AI_MODEL),
    source: 'ai',
    marketCap: 'large',
  }
}

/** Expert DB Notion 페이지 → Research 타입 변환 (source: 'expert' 고정) */
export function mapExpertPageToResearch(page: PageObjectResponse): Research {
  const props = page.properties
  return {
    id: page.id,
    title: getTitle(props, NOTION_PROPERTIES.TITLE),
    stockName: getRichText(props, NOTION_PROPERTIES.STOCK_NAME),
    ticker: getRichText(props, NOTION_PROPERTIES.TICKER),
    sector: getSelect(props, NOTION_PROPERTIES.SECTOR),
    tags: getMultiSelect(props, NOTION_PROPERTIES.TAGS),
    opinion: parseOpinion(getSelect(props, NOTION_PROPERTIES.OPINION)),
    targetPrice: undefined,
    expertBuyPrice: getNumber(props, NOTION_PROPERTIES.EXPERT_BUY_PRICE),
    currency: parseCurrency(getSelect(props, NOTION_PROPERTIES.CURRENCY)),
    summary: getRichText(props, NOTION_PROPERTIES.SUMMARY),
    publishedAt: getDate(props, NOTION_PROPERTIES.PUBLISHED_AT),
    status: (getStatus(props, NOTION_PROPERTIES.STATUS) as Research['status']) || 'draft',
    aiModel: getRichText(props, NOTION_PROPERTIES.FIRM),
    source: 'expert',
    marketCap: 'large',
  }
}
