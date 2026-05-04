import { NotionToMarkdown } from 'notion-to-md'
import { notionClient } from './client'

const n2m = new NotionToMarkdown({ notionClient })

/**
 * Notion 페이지 블록을 Markdown 문자열로 변환
 * @returns 변환된 마크다운 문자열, 실패 시 빈 문자열
 */
export async function getPageMarkdown(pageId: string): Promise<string> {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    const mdString = n2m.toMarkdownString(mdBlocks)
    return mdString.parent ?? ''
  } catch (error) {
    console.error(`[notion-to-md] 페이지 변환 실패 (${pageId}):`, error)
    return ''
  }
}
