<template>
  <ClientOnly>
    <div
      v-if="isShown"
      ref="confetti"
      class="z-40 mx-auto h-dvh w-dvw fixed inset-0 overflow-y-hidden overscroll-y-none"
    >
      <div v-confetti="{ particleCount: 240, duration: 4500, stageHeight: confetti?.clientHeight, stageWidth: confetti?.clientWidth, force: 0.4 }" />
    </div>
  </ClientOnly>

  <main class="tg-text tg-safe-area">
    <slot />
  </main>

  <Navigation v-if="userStore.id" />
</template>

<script setup lang="ts">
import { vConfetti } from '@neoconfetti/vue'

const confetti = ref<HTMLElement | null>(null)
const { isShown } = useConfetti()

const userStore = useUserStore()
</script>
