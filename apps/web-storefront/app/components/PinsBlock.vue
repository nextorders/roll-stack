<template>
  <div class="mt-8 w-full">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="preparedPins"
      loop
      arrows
      :auto-scroll="{
        active: true,
        playOnInit: true,
        startDelay: 200,
        speed: 0.5,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }"
      :ui="{
        item: 'basis-60 py-1',
        prev: 'absolute left-4! size-10 justify-center rounded-full',
        next: 'absolute right-4! size-10 justify-center rounded-full',
      }"
    >
      <NuxtLink
        :to="undefined"
        class="h-full self-start"
      >
        <UPageCard
          variant="subtle"
          :ui="{
            root: 'w-56 aspect-2/3 self-start hover:scale-98 active:scale-95 duration-200 cursor-pointer',
            container: 'p-0!',
          }"
        >
          <template #body>
            <div v-if="item.type === 'review_quote_with_image'" class="h-full p-2.5 flex flex-col gap-2 justify-between overflow-hidden">
              <div class="flex flex-col gap-2">
                <div class="flex flex-row gap-2 items-center line-clamp-1">
                  <UAvatar
                    v-if="item.user?.avatarUrl"
                    :src="item.user.avatarUrl"
                    size="md"
                  />
                  <h4 class="font-semibold leading-6">
                    {{ item.user?.name }}
                  </h4>
                </div>

                <p class="text-sm/4 text-muted italic before:content-[open-quote] after:content-[close-quote] line-clamp-3">
                  {{ item.text }}
                </p>
              </div>

              <div class="shrink-0 w-full h-auto aspect-square flex flex-col justify-center items-center rounded-lg">
                <img
                  v-if="item.mediaUrl"
                  :src="item.mediaUrl"
                  loading="lazy"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>

            <div v-if="item.type === 'image'" class="w-full h-full">
              <img
                v-if="item.mediaUrl"
                :src="item.mediaUrl"
                loading="lazy"
                class="w-full h-full object-cover rounded-lg"
              >
            </div>
          </template>
        </UPageCard>
      </NuxtLink>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import type { ShallowRef, ShallowUnwrapRef } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const { pins } = defineProps<{ pins: any[] }>()

const carousel = useTemplateRef('carousel')
const { isOutside } = useMouseInElement(carousel as unknown as ShallowRef<ShallowUnwrapRef<HTMLElement>>)

onMounted(() => {
  const interval = setInterval(() => {
    if (carousel.value && isOutside.value) {
      carousel.value?.emblaApi?.plugins().autoScroll.play()
    }
  }, 2000)
  onBeforeUnmount(() => clearInterval(interval))
})

const minimum = 9

function getImageByIndex(index: number) {
  if (index === 0) {
    return '/slider-test-0.jpg'
  }
  if (index === 1) {
    return '/slider-test-1.jpg'
  }

  return ''
}

const preparedPins = computed(() => {
  const filtered = pins.filter((pin) => pin.type !== 'empty')
  const emptyCount = Math.max(0, minimum - filtered.length)
  const emptyPins: any[] = Array.from({ length: emptyCount }, (_, i) => ({
    id: `empty-${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'image',
    userId: null,
    user: null,
    text: null,
    mediaUrl: getImageByIndex(i),
    pageId: 'placeholder',
  }))
  return [...filtered, ...emptyPins]
})
</script>
