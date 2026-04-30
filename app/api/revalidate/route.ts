import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/constants/cache'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: 401 })
  }

  const tag = searchParams.get('tag') ?? CACHE_TAGS.RESEARCH_LIST
  revalidateTag(tag, 'max')

  return Response.json({ revalidated: true, tag })
}
