function _useNavigation() {
  const router = useRouter()
  const { t } = useI18n()
  const { y } = useWindowScroll()

  const mainRoutes = computed<NavigationRoute[]>(() => [
    {
      path: '/',
      name: 'home',
      title: t('app.home'),
      icon: 'i-lucide-layout-dashboard',
      exact: true,
    },
    {
      path: '/client',
      name: 'client',
      title: t('app.cabinet'),
      icon: 'i-lucide-user',
    },
    {
      path: '/menu',
      name: 'menu',
      title: t('app.menu'),
      icon: 'i-lucide-menu',
    },
  ])

  const isNavigationShown = ref(true)

  const isCatalogPage = computed(() => router.currentRoute.value.path === '/')
  const canScrollToTop = computed(() => y.value > 650)

  const isClientInnerPage = computed(() => router.currentRoute.value.path.startsWith('/client'))
  const canReturnToCabinet = computed(() => isClientInnerPage.value && router.currentRoute.value.path !== '/client')

  const isCartButtonShown = computed(() => isCatalogPage.value)
  const isCategoriesButtonShown = computed(() => isCatalogPage.value && canScrollToTop.value)
  const isAverageProgressButtonShown = computed(() => isCatalogPage.value)

  return {
    isNavigationShown,

    isCartButtonShown,
    isCategoriesButtonShown,
    isAverageProgressButtonShown,

    isClientInnerPage,
    canReturnToCabinet,

    isCatalogPage,
    canScrollToTop,

    mainRoutes,
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
