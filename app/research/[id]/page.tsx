export const revalidate = 86400

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      <p className='text-sm text-muted-foreground'>리서치 상세 페이지 — {id}</p>
      {/* TODO: Task 008에서 Notion 본문 렌더링 구현 */}
    </div>
  )
}
