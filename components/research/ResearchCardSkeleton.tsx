import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** ResearchCard 로딩 상태를 표시하는 스켈레톤 컴포넌트 */
export function ResearchCardSkeleton() {
  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-3 py-4'>
        {/* 상단 영역: 종목명 + 티커 + 배지 */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-1.5 min-w-0 flex-1'>
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-3 w-1/4' />
          </div>
          <Skeleton className='h-5 w-10 shrink-0 rounded-full' />
        </div>

        {/* 중간 영역: 목표가 + 발행일 */}
        <div className='flex items-center justify-between gap-2'>
          <Skeleton className='h-7 w-1/3' />
          <Skeleton className='h-4 w-1/4' />
        </div>

        {/* 하단 영역: 요약 + 태그 */}
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
          <div className='flex gap-1 pt-1'>
            <Skeleton className='h-4 w-12 rounded-full' />
            <Skeleton className='h-4 w-16 rounded-full' />
            <Skeleton className='h-4 w-10 rounded-full' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
