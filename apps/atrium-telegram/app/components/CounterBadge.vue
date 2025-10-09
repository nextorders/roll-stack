<template>
  <UBadge
    v-if="value != null && value > 0"
    size="lg"
    color="primary"
    variant="solid"
    :label="value"
    class="min-w-8 justify-center text-base/4 font-semibold"
  />
</template>

<script setup lang="ts">
defineProps<{ value?: number | null }>()
</script>
