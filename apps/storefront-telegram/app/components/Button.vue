<template>
  <button
    class="p-3 tg-bg-button w-full rounded-2xl font-medium cursor-pointer active:scale-95 duration-200"
    @click="vibrate()"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
</script>
