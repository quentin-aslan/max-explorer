import { computed, ref } from 'vue'

export function useHeaderHeights(isMobile: Ref<boolean>) {
  const mobileHeader = ref<HTMLElement | null>(null)
  const desktopHeader = ref<HTMLElement | null>(null)

  const contentMainMarginTop = computed(() => {
    return isMobile.value
      ? `${mobileHeader.value?.offsetHeight}px`
      : `${desktopHeader.value?.offsetHeight}px`
  })

  const contentMainMinHeight = computed(() => {
    return isMobile.value
      ? `calc(100vh - ${mobileHeader.value?.offsetHeight}px)`
      : `calc(100vh - ${desktopHeader.value?.offsetHeight}px)`
  })

  return { mobileHeader, desktopHeader, contentMainMarginTop, contentMainMinHeight }
}
