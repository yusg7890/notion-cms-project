import type { MetadataRoute } from 'next'

/** PRD F011: 법적 리스크 방지 - 기본적으로 검색엔진 색인 차단 */
export default function robots(): MetadataRoute.Robots {
  const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'
  return {
    rules: {
      userAgent: '*',
      disallow: isIndexable ? [] : ['/'],
    },
  }
}
