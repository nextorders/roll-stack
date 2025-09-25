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
      <h4 class="text-2xl text-neutral-950 font-black uppercase">
        {{ item }}
      </h4>

      <img
        src="/sushi-heart.svg"
        alt=""
        class="w-10 h-auto opacity-90"
      >
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = ref<string[]>([
  'Вебинар Суши Love 2025',
  'Будем делиться опытом',
  'Как избежать ошибок',
  'На 100% бесплатно',
])

onMounted(() => {
  // add items
  for (let i = 0; i < 5; i++) {
    items.value.push(...items.value)
  }
})
</script>
