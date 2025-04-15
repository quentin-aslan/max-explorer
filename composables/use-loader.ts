const isLoaderVisible = ref(false)
const messageDisplayed = ref<string | null>()

export const useLoader = () => {
  const startLoading = (msg?: string) => {
    if (msg) messageDisplayed.value = msg
    else messageDisplayed.value = null
    isLoaderVisible.value = true
  }

  const stopLoading = () => {
    isLoaderVisible.value = false
  }

  return {
    startLoading,
    stopLoading,
    isLoaderVisible,
    messageDisplayed,
  }
}
