<template>
  <button class="relative w-full active:scale-95 duration-200 text-left cursor-pointer outline-0" @click="vibrate()">
    <Section>
      <slot />
    </Section>
  </button>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
</script>
