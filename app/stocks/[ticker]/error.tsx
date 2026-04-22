'use client'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4'>
      <h2 className='text-lg font-semibold'>종목 히스토리를 불러올 수 없습니다</h2>
      <p className='text-sm text-muted-foreground'>{error.message || '알 수 없는 오류입니다.'}</p>
      <button
        onClick={() => unstable_retry()}
        className='rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground'
      >
        다시 시도
      </button>
    </div>
  )
}
