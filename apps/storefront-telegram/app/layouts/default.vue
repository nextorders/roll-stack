<template>
  <main class="tg-text tg-safe-area">
    <slot />
  </main>

  <CitySelector />
  <Navigation v-if="clientStore.id" />
</template>

<script setup lang="ts">
const clientStore = useClientStore()
</script>
