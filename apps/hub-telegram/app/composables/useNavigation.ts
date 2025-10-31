function _useNavigation() {
  const router = useRouter()
  const { t } = useI18n()
  const { y } = useWindowScroll()

  const mainRoutes = computed<NavigationRoute[]>(() => [
    {
      path: '/',
      names: ['index', 'flow-itemId', 'flow-new'],
      title: t('app.flow'),
      icon: 'i-lucide-waves',
      exact: true,
      // badge: flowStore.nowViewedItemsCount > 10 ? '10+' : flowStore.nowViewedItemsCount.toString(),
    },
    {
      path: '/point',
      names: ['point'],
      title: t('app.rewards'),
      icon: 'i-lucide-coins',
    },
    {
      path: '/task',
      names: ['task'],
      title: t('app.tasks'),
      icon: 'i-lucide-check-check',
    },
    {
      path: '/navigation',
      names: ['navigation'],
      title: t('app.navigation'),
      icon: 'i-lucide-menu',
    },
  ])

  const isNavigationShown = ref(true)

  const isMainPage = computed(() => router.currentRoute.value.path === '/')
  const canScrollToTop = computed(() => y.value > 650)

  return {
    isNavigationShown,

    isMainPage,
    canScrollToTop,

    mainRoutes,
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
