<template>
  <div class="flex flex-row gap-2">
    <UButton
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      size="xl"
      color="neutral"
      variant="ghost"
      :icon="item.icon"
    />
  </div>
</template>

<script setup lang="ts">
const items = ref([
  {
    to: 'https://t.me/SLFranchiseBot',
    icon: 'simple-icons:telegram',
  },
  {
    to: 'https://vk.com/franshizasushi',
    icon: 'simple-icons:vk',
  },
])
</script>
