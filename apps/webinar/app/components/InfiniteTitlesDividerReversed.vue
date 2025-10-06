<template>
  <div class="w-full h-46 overflow-x-hidden">
    <div class="bg-[#ed1c24] rotate-3 -ml-6 -mr-6 mt-16">
      <UCarousel
        v-slot="{ item }"
        :start-index="items.length - 1"
        :auto-scroll="{
          speed: -1,
        }"
        :items="items"
        :ui="{
          item: 'shrink-0 basis-full md:basis-1/2 min-w-120 h-full min-h-16 flex flex-row gap-4 items-center justify-around',
        }"
      >
        <h4 class="text-2xl/7 text-white font-black uppercase text-center">
          {{ item }}
        </h4>

        <img
          src="/sushi-heart-256.png"
          alt=""
          class="w-10 h-auto opacity-90"
        >
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<string[]>([
  'Франшиза Суши Love',
  '12 лет на рынке',
  'Более 100 успешных заведений по РФ и СНГ',
  'Средняя окупаемость по сети — 3 месяца',
])

onMounted(() => {
  // add items
  for (let i = 0; i < 5; i++) {
    items.value.push(...items.value)
  }
})
</script>
