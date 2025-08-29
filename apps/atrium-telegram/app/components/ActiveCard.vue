<template>
  <div class="relative active:scale-95 duration-200" @click="vibrate()">
    <Section>
      <slot />
    </Section>
  </div>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
</script>
