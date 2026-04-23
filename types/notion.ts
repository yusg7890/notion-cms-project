/** Notion API 응답 최소 래퍼 타입 — @notionhq/client 설치(Task 006) 후 확장 예정 */

export interface NotionTitlePropertyValue {
  type: 'title'
  title: Array<{ plain_text: string }>
}

export interface NotionRichTextPropertyValue {
  type: 'rich_text'
  rich_text: Array<{ plain_text: string }>
}

export interface NotionSelectPropertyValue {
  type: 'select'
  select: { name: string } | null
}

export interface NotionMultiSelectPropertyValue {
  type: 'multi_select'
  multi_select: Array<{ name: string }>
}

export interface NotionNumberPropertyValue {
  type: 'number'
  number: number | null
}

export interface NotionDatePropertyValue {
  type: 'date'
  date: { start: string } | null
}

export type NotionPropertyValue =
  | NotionTitlePropertyValue
  | NotionRichTextPropertyValue
  | NotionSelectPropertyValue
  | NotionMultiSelectPropertyValue
  | NotionNumberPropertyValue
  | NotionDatePropertyValue

export interface NotionPageProperties {
  [key: string]: NotionPropertyValue
}
