<template>
  <main class="tg-bg-secondary tg-text tg-safe-area">
    <slot />
  </main>

  <Navigation v-if="userStore.id" />
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>
