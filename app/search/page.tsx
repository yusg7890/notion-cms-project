export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      <p className='text-sm text-muted-foreground'>
        검색 페이지{q ? ` — "${q}"` : ''}
      </p>
      {/* TODO: Task 010에서 검색 기능 구현 */}
    </div>
  )
}
