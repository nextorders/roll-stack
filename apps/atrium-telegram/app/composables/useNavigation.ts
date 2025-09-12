function _useNavigation() {
  const router = useRouter()
  const { t } = useI18n()
  const { y } = useWindowScroll()

  const mainRoutes = computed<NavigationRoute[]>(() => [
    {
      path: '/',
      name: 'flow',
      title: t('app.flow'),
      icon: 'i-lucide-waves',
      exact: true,
    },
    {
      path: '/epic',
      name: 'epic',
      title: t('app.epics'),
      icon: 'i-lucide-crown',
    },
    {
      path: '/tasks',
      name: 'tasks',
      title: t('app.my-tasks'),
      icon: 'i-lucide-layout-dashboard',
    },
  ])

  const isNavigationShown = ref(true)

  const isMainPage = computed(() => router.currentRoute.value.path === '/')
  const canScrollToTop = computed(() => y.value > 650)

  const isFlowInnerPage = computed(() => router.currentRoute.value.path.startsWith('/flow'))
  const canReturnToMain = computed(() => isFlowInnerPage.value && router.currentRoute.value.path !== '/')

  return {
    isNavigationShown,

    isFlowInnerPage,
    canReturnToMain,

    isMainPage,
    canScrollToTop,

    mainRoutes,
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
