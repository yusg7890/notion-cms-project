import Link from 'next/link'
import { Button } from '@/components/ui/button'

/** 필터 결과가 없을 때 표시하는 빈 상태 컴포넌트 */
export function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
      <span className='text-5xl' aria-hidden='true'>
        📭
      </span>
      <div className='flex flex-col gap-1'>
        <p className='text-base font-semibold'>조건에 맞는 리서치가 없습니다</p>
        <p className='text-sm text-muted-foreground'>
          선택한 섹터 또는 태그에 해당하는 리서치를 찾을 수 없습니다.
          <br />
          필터를 초기화하고 전체 목록을 확인해보세요.
        </p>
      </div>
      <Button asChild variant='outline' size='sm'>
        <Link href='/'>필터 초기화</Link>
      </Button>
    </div>
  )
}
