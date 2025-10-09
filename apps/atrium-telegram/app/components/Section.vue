<template>
  <div class="relative p-4 tg-bg-section group/section space-y-3.5 rounded-lg" :class="props.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ class?: string }>()
</script>
