<template>
  <button
    class="relative w-full h-full active:scale-95 duration-200 text-left cursor-pointer outline-0"
    @click="vibrate()"
  >
    <Section :class="props.class">
      <slot />
    </Section>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ class?: string }>()

const { vibrate } = useFeedback()
</script>
