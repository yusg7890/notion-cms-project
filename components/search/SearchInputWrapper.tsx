import { SearchInput } from './SearchInput'
import type { ComponentProps } from 'react'

/**
 * SearchInput을 직접 사용 가능 — useSearchParams 의존성이 제거되어 Suspense 불필요
 * @deprecated 이 래퍼는 더 이상 필요하지 않습니다. SearchInput을 직접 임포트하세요.
 */
export function SearchInputWrapper(props: ComponentProps<typeof SearchInput>) {
  return <SearchInput {...props} />
}
