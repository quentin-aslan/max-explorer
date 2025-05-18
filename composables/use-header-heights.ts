import { computed, ref } from 'vue'

export function useHeaderHeights(isMobile: Ref<boolean>) {
  const mobileHeader = ref<HTMLElement | null>(null)
  const desktopHeader = ref<HTMLElement | null>(null)

  const contentMainMarginTop = computed(() => {
    return isMobile.value
      ? `${(mobileHeader.value?.offsetHeight || 0) + 10}px` // Add 10px extra margin for mobile to ensure content is not hidden
      : `${desktopHeader.value?.offsetHeight}px`
  })

  const contentMainMinHeight = computed(() => {
    return isMobile.value
      ? `calc(100vh - ${(mobileHeader.value?.offsetHeight || 0) + 10}px)` // Add 10px to match the extra margin
      : `calc(100vh - ${desktopHeader.value?.offsetHeight}px)`
  })

  return { mobileHeader, desktopHeader, contentMainMarginTop, contentMainMinHeight }
}
