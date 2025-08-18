<template>
  <UButton
    icon="i-lucide-menu"
    color="neutral"
    variant="outline"
    square
    @click="isNavbarOpened = true"
  />
</template>

<script setup lang="ts">
const { isNavbarOpened } = useApp()
</script>
