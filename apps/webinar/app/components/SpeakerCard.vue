<template>
  <div class="flex flex-col gap-2">
    <!-- <img
      :src="speaker.image"
      alt=""
      class="w-full"
    > -->

    <div class="shrink-0 p-4 w-full h-auto text-muted bg-accented rounded-lg aspect-square">
      Фото?
    </div>

    <h4 class="text-2xl font-bold">
      {{ speaker.name }}
    </h4>
    <p class="text-muted">
      {{ speaker.caption }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ speaker: { name: string, caption: string, image: string } }>()
</script>
