<template>
  <picture v-if="media?.items?.length">
    <source type="image/webp" :srcset="srcWebp">
    <img
      :loading="lazy ? 'lazy' : 'eager'"
      :src="src"
      alt=""
      class="rounded-lg w-full"
    >
  </picture>

  <div v-else class="w-full h-full flex items-center justify-center border-2 border-dashed border-default rounded-lg">
    <UIcon
      name="i-lucide-camera-off"
      class="text-muted/25"
      :class="{
        'size-6': size === 'xs',
        'size-12': size === 'sm',
        'size-16': size === 'md',
        'size-20': size === 'lg',
        'size-24': size === 'xl',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { MediaItem } from '@roll-stack/database'
import type { MediaWithItems } from '~/stores/menu'

const { media, lazy = true, size = 'sm' } = defineProps<{
  media?: MediaWithItems | null
  lazy?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>()

const sizesMap = {
  xs: 120,
  sm: 300,
  md: 600,
  lg: 840,
  xl: 1200,
}

const src = computed(() => getNearestImageBySizeAndFormat(sizesMap[size], 'jpg', media?.items ?? [])?.url)
const srcWebp = computed(() => getNearestImageBySizeAndFormat(sizesMap[size], 'webp', media?.items ?? [])?.url)

function getNearestImageBySizeAndFormat(size: number, format: MediaItem['format'], items: MediaItem[]): MediaItem | undefined {
  if (!items?.length) {
    return
  }

  const filteredByFormat = items.filter((item) => item.format === format)

  return filteredByFormat.reduce((prev, curr) => {
    return Math.abs(curr.size - size) < Math.abs(prev.size - size) ? curr : prev
  })
}
</script>
