<template>
  <div class="relative active:scale-90 duration-200 motion-preset-slide-left" @click="vibrate()">
    <Section>
      <slot />
    </Section>
  </div>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
</script>
