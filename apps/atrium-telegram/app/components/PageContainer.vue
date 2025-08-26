<template>
  <div class="z-30 overflow-hidden h-full min-h-dvh w-full tg-content-safe-area">
    <div class="px-4 py-2 max-w-[28rem] mx-auto flex flex-col gap-y-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hideBackButton } from '@telegram-apps/sdk-vue'

const { back = true } = defineProps<{ back?: boolean }>()

onMounted(() => !back && hideBackButton())
</script>
