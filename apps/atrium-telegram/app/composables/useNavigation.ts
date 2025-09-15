function _useNavigation() {
  const router = useRouter()
  const { t } = useI18n()
  const { y } = useWindowScroll()

  const taskStore = useTaskStore()
  const flowStore = useFlowStore()

  const mainRoutes = computed<NavigationRoute[]>(() => [
    {
      path: '/',
      names: ['index', 'flow-itemId'],
      title: t('app.flow'),
      icon: 'i-lucide-waves',
      exact: true,
      badge: flowStore.nowViewedItemsCount.toString(),
    },
    {
      path: '/epic',
      names: ['epic', 'epic-epicId'],
      title: t('app.epics'),
      icon: 'i-lucide-crown',
    },
    {
      path: '/tasks',
      names: ['tasks'],
      title: t('app.my-tasks'),
      icon: 'i-lucide-layout-dashboard',
      badge: taskStore.myTodayTasks.length.toString(),
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
