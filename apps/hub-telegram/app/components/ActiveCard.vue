<template>
  <button
    class="relative w-full active:scale-95 duration-200 text-left cursor-pointer outline-0"
    :class="props.class"
    @click="vibrate()"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ class?: string }>()

const { vibrate } = useFeedback()
</script>
