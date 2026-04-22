import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4'>
      <h2 className='text-lg font-semibold'>리서치를 찾을 수 없습니다</h2>
      <p className='text-sm text-muted-foreground'>해당 리서치가 존재하지 않거나 삭제되었습니다.</p>
      <Link href='/' className='text-sm underline underline-offset-4'>
        홈으로 돌아가기
      </Link>
    </div>
  )
}
