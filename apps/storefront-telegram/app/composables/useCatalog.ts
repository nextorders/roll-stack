function _useCatalog() {
  const visibleCategory = ref<string | null>(null)

  const observerOptions = { rootMargin: '0px 0px 200px 0px' }

  const scrollToCategoryInHorizontalMenu = useDebounceFn(() => {
    const category = window.document.getElementById(`to-${visibleCategory.value}`)
    category?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, 800)

  watch(visibleCategory, () => scrollToCategoryInHorizontalMenu())

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
