<template>
  <div ref="target" class="relative w-full h-auto aspect-3/2 perspective-normal motion-preset-slide-down">
    <div
      class="absolute inset-0 bg-primary rounded-lg"
      :style="{
        transform: `rotateX(${parallax.roll * 3}deg) rotateY(${parallax.tilt * 3}deg)`,
      }"
    />

    <div
      class="z-10 w-full h-full p-4 flex flex-col justify-between tg-text-button"
      :style="{
        transform: `rotateX(${parallax.roll * 2}deg) rotateY(${parallax.tilt * 2}deg)`,
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
          class="w-12 opacity-20 invert-100"
        >
      </div>

      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row gap-2 items-center">
          <div class="px-3.5 py-1.5 text-2xl/5 text-primary font-bold ring ring-default bg-default rounded-2xl">
            5%
          </div>

          <div>
            Кешбэк
          </div>
        </div>

        <UIcon name="i-lucide-info" class="size-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useParallax } from '@vueuse/core'

const target = useTemplateRef<HTMLElement>('target')
const parallax = reactive(useParallax(target))
</script>
