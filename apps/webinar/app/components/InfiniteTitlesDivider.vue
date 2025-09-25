<template>
  <div class="bg-[#ffed00]">
    <UCarousel
      v-slot="{ item }"
      loop
      :auto-scroll="{
        speed: 1,
      }"
      :items="items"
      :ui="{
        item: 'shrink-0 basis-full md:basis-1/3 min-w-120 h-full min-h-16 flex flex-row gap-4 items-center justify-around',
      }"
    >
      <h4 class="text-2xl font-black uppercase">
        {{ item }}
      </h4>

      <img
        src="/sushi-heart.svg"
        alt=""
        class="w-10 h-auto opacity-15"
      >
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  'Вебинар Суши Love 2025',
  'Будем делиться опытом',
  'Как избежать ошибок',
  'На 100% бесплатно',
]
</script>
