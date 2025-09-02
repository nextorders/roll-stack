<template>
  <div class="z-40 sticky top-0 h-fit tg-bg-secondary">
    <div class="max-w-full overflow-x-scroll snap-x">
      <div class="w-max flex flex-row flex-wrap gap-5">
        <div
          v-for="category in menuStore.menu?.categories"
          :key="category.id"
          class="scroll-ml-6 snap-start"
        >
          <button class="py-2" @click="scrollToCategory(category.slug)">
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()

const menuStore = useMenuStore()

function scrollToCategory(id: string) {
  vibrate()

  const category = window.document.getElementById(id)
  category?.scrollIntoView({ behavior: 'smooth' })
}
</script>
