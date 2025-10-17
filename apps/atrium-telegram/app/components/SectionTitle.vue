<template>
  <h2 class="text-2xl/7 font-bold tracking-tight">
    {{ title }}
  </h2>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
