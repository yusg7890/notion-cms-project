declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NOTION_TOKEN: string
      NOTION_DB_ID: string
      REVALIDATE_SECRET: string
      NEXT_PUBLIC_SITE_INDEXABLE?: string
    }
  }
}

export {}
