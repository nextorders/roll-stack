<template>
  <div class="flex flex-col gap-3.5 motion-preset-slide-up">
    <div class="shrink-0 w-full h-auto text-muted bg-muted rounded-lg aspect-square">
      <img
        :src="speaker.image"
        alt=""
        class="w-full h-full object-cover rounded-lg"
      >
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
