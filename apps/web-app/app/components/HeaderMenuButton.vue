<template>
  <UButton
    icon="i-lucide-menu"
    color="neutral"
    variant="outline"
    @click="isNavbarOpened = true"
  />
</template>

<script setup lang="ts">
const { isNavbarOpened } = useApp()
</script>
