import { Client } from '@notionhq/client'

if (!process.env.NOTION_TOKEN) {
  throw new Error(
    '[Notion] NOTION_TOKEN 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
  )
}

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 60_000,
})

/** AI Research Notion DB ID */
export const AI_DB_ID = process.env.NOTION_AI_DB_ID ?? ''

/** Expert Research Notion DB ID */
export const EXPERT_DB_ID = process.env.NOTION_EXPERT_DB_ID ?? ''

if (!AI_DB_ID) {
  console.warn('[Notion] NOTION_AI_DB_ID 환경 변수가 설정되지 않았습니다.')
}
if (!EXPERT_DB_ID) {
  console.warn('[Notion] NOTION_EXPERT_DB_ID 환경 변수가 설정되지 않았습니다.')
}
