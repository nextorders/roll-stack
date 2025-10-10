<template>
  <div class="z-30 overflow-hidden h-full min-h-dvh w-full tg-content-safe-area">
    <div class="px-4 py-2 max-w-[28rem] mx-auto mb-20 flex flex-col gap-y-6" :class="className">
      <slot />

      <div class="mt-22 flex flex-row justify-center">
        <img
          src="/sushi-heart.svg"
          alt=""
          class="w-14 opacity-15 invert-50"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hideBackButton } from '@telegram-apps/sdk-vue'

const { back = true, class: className } = defineProps<{ back?: boolean, class?: string }>()

onMounted(() => !back && hideBackButton())
</script>
