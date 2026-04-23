import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** ResearchCard 로딩 중 표시할 스켈레톤 */
export function ResearchCardSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 space-y-1'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-3 w-12' />
          </div>
          <Skeleton className='h-5 w-10 shrink-0 rounded-full' />
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-3 w-16' />
        </div>
      </CardHeader>
      <CardContent className='pb-4'>
        <div className='mb-3 space-y-1.5'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-4/5' />
        </div>
        <div className='flex gap-1'>
          <Skeleton className='h-4 w-12 rounded-full' />
          <Skeleton className='h-4 w-10 rounded-full' />
          <Skeleton className='h-4 w-14 rounded-full' />
        </div>
      </CardContent>
    </Card>
  )
}
