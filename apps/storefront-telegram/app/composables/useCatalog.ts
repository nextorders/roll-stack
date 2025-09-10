function _useCatalog() {
  const visibleCategory = ref<string | null>(null)
  const lastVisibleCategory = ref<string | null>(null)

  const observerOptions = { rootMargin: '0px 0px 200px 0px' }

  function scrollToCategoryInHorizontalMenu() {
    if (!visibleCategory.value || lastVisibleCategory.value === visibleCategory.value) {
      return
    }

    lastVisibleCategory.value = visibleCategory.value

    const category = window.document.getElementById(`to-${visibleCategory.value}`)
    if (!category) {
      return
    }

    category.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  onMounted(() => {
    // Activate scroll watcher after some time
    setTimeout(() => {
      lastVisibleCategory.value = visibleCategory.value
      setInterval(scrollToCategoryInHorizontalMenu, 250)
    }, 2000)
  })

  function scrollToCategory(slug: string) {
    const category = window.document.getElementById(slug)
    if (!category) {
      return
    }

    visibleCategory.value = slug
    category.scrollIntoView({ behavior: 'instant' })
  }

  return {
    visibleCategory,
    observerOptions,

    scrollToCategory,
  }
}

export const useCatalog = createSharedComposable(_useCatalog)
