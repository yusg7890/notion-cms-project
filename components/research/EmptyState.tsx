import Link from 'next/link'

/** 필터 결과 없음 상태 컴포넌트 */
export function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <p className='text-lg font-semibold'>조건에 맞는 리서치가 없습니다</p>
      <p className='mt-1 text-sm text-muted-foreground'>
        다른 섹터나 태그로 검색해 보세요.
      </p>
      <Link
        href='/'
        className='mt-4 text-sm text-primary underline underline-offset-4 hover:text-primary/80'
      >
        필터 초기화
      </Link>
    </div>
  )
}
