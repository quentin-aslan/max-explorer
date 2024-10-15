// Détection si on est sur mobile
export const useIsMobile = () => {
    const isMobile = ref(false)
    onMounted(() => {
        const checkMobile = () => {
            isMobile.value = window.innerWidth <= 1024
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
    })

    return {
        isMobile
    }
}