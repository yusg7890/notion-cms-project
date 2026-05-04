import type { NextRequest } from 'next/server'
import { searchResearches } from '@/lib/notion/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (!q) {
    return Response.json([])
  }

  try {
    const results = await searchResearches(q)
    return Response.json(results)
  } catch (error) {
    console.error('[API /search] 검색 실패:', error)
    return Response.json({ error: '검색 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
