<template>
  <div class="z-40 sticky -top-0.5 h-fit tg-safe-area tg-bg-secondary">
    <div class="max-w-full overflow-x-scroll snap-x tg-content-safe-area-top">
      <div class="py-1 w-max flex flex-row flex-wrap gap-1">
        <div
          v-for="category in menuStore.menu?.categories"
          :id="`to-${category.slug}`"
          :key="category.id"
          class="scroll-ml-24 snap-start text-sm text-muted rounded-full"
          :class="{ 'tg-text-button bg-primary': visibleCategory === category.slug }"
        >
          <button class="px-2.5 py-1" @click="scrollToCategory(category.slug)">
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
const { visibleCategory } = useCatalog()

const menuStore = useMenuStore()

function scrollToCategory(id: string) {
  vibrate()

  const category = window.document.getElementById(id)
  category?.scrollIntoView({ behavior: 'smooth' })
}
</script>
