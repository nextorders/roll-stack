function _useApp() {
  const route = useRoute()

  const isNavbarOpened = ref(false)
  const isNotificationsOpened = ref(false)
  const imagesMode = ref<'color' | 'grayscale'>('color')

  watch(
    () => route.fullPath,
    () => {
      isNavbarOpened.value = false
      isNotificationsOpened.value = false
    },
  )

  return {
    isNavbarOpened,
    isNotificationsOpened,
    imagesMode,
  }
}

export const useApp = createSharedComposable(_useApp)
