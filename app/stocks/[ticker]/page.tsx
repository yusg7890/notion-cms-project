export const revalidate = 3600

export default async function StockHistoryPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      <p className='text-sm text-muted-foreground'>종목 히스토리 페이지 — {ticker}</p>
      {/* TODO: Task 009에서 시계열 차트 및 리서치 목록 구현 */}
    </div>
  )
}
