function _useCatalog() {
  const visibleCategory = ref<string | null>(null)

  const observerOptions = { rootMargin: '0px 0px 0px 0px' }

  const scrollToCategory = useDebounceFn(() => {
    const category = window.document.getElementById(`to-${visibleCategory.value}`)
    category?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, 1000)

  watch(visibleCategory, () => scrollToCategory())

  return {
    visibleCategory,
    observerOptions,
  }
}

export const useCatalog = createSharedComposable(_useCatalog)
