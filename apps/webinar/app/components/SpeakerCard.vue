<template>
  <div class="flex flex-col gap-3.5 motion-preset-slide-up">
    <div class="shrink-0 relative w-full h-auto aspect-square">
      <div class="w-full h-full bg-secondary mask-[url(/heart-fill.svg)] mask-origin-fill mask-cover mask-center -rotate-4" />
      <div
        class="absolute inset-0 shrink-0 w-9/12 mx-auto my-auto aspect-square bg-cover -rotate-2"
        :style="`background-image: url(${speaker.image});`"
      />
    </div>

    <div class="flex flex-col gap-2">
      <h4 class="text-2xl font-bold">
        {{ speaker.name }}
      </h4>
      <p class="text-base/5 font-semibold">
        {{ speaker.caption }}
      </p>
      <p class="text-base/5 text-muted">
        {{ speaker.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ speaker: { name: string, caption: string, description: string, image: string } }>()
</script>
