const isLoaderVisible = ref(false)

export const useLoader = () => {
    const startLoading = () => {
        isLoaderVisible.value = true
        console.log('isLoaderVisible : ', isLoaderVisible)
    }

    const stopLoading = () => {
        isLoaderVisible.value = false
    }

    return {
        startLoading,
        stopLoading,
        isLoaderVisible,
    }
}
