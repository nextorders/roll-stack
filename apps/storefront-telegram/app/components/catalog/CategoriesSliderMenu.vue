<template>
  <div class="z-40 sticky top-0 h-18 bg-primary">
    <div class="max-w-full overflow-x-scroll snap-x">
      <div class="w-max flex flex-row flex-wrap gap-5">
        <div
          v-for="category in menuStore.menu?.categories"
          :key="category.id"
          class="scroll-ml-6 snap-start"
        >
          <div class="p-0">
            {{ category.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()
</script>
