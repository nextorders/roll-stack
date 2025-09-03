<template>
  <div class="relative w-full h-auto aspect-3/2 perspective-normal motion-preset-slide-down">
    <div
      class="absolute inset-0 bg-primary rounded-lg"
      :style="{
        transform: `rotateX(${x * 5}deg) rotateY(${y * 5}deg)`,
      }"
    />

    <div
      class="z-10 w-full h-full p-4 flex flex-col justify-between tg-text-button"
      :style="{
        transform: `rotateX(${x * 3}deg) rotateY(${y * 3}deg)`,
      }"
    >
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col gap-3">
          <div class="text-lg/5 font-medium">
            Карта лояльности
          </div>
          <div class="flex flex-row gap-1.5 items-center">
            <p class="text-3xl/5 font-semibold">
              680
            </p>
            <UIcon name="fluent:heart-circle-24-filled" class="size-6" />
          </div>
        </div>

        <img
          src="/sushi-heart.svg"
          alt=""
          class="w-12 opacity-35 invert-100"
        >
      </div>

      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row gap-2 items-center">
          <div class="px-3.5 py-1.5 text-2xl/5 text-primary font-bold rounded-full tg-bg-section">
            5%
          </div>

          <div class="tg-text-inverted">
            Кешбэк
          </div>
        </div>

        <UIcon name="i-lucide-info" class="size-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventListener } from '@telegram-apps/sdk-vue'
import { off, on } from '@telegram-apps/sdk-vue'

const x = ref(0)
const y = ref(0)
const z = ref(0)

const listener: EventListener<'gyroscope_changed'> = (payload) => {
  x.value = payload.x
  y.value = payload.y
  z.value = payload.z
}

onMounted(() => {
  on('gyroscope_changed', listener)
})

onUnmounted(() => {
  off('gyroscope_changed', listener)
})
</script>
