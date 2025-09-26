<template>
  <div class="px-2 md:px-5 py-4 min-w-18 md:min-w-24 bg-inverted rounded-lg flex flex-col items-center">
    <h3 class="text-3xl font-bold text-inverted">
      {{ value }}
    </h3>
    <span class="text-sm text-dimmed">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number, label: string }>()
</script>
