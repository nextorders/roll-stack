<template>
  <div class="w-full h-46 overflow-x-hidden">
    <div class="bg-[#ed1c24] -rotate-3 -ml-6 -mr-6 mt-16">
      <UCarousel
        v-slot="{ item }"
        :auto-scroll="{
          speed: 1,
        }"
        :items="items"
        :ui="{
          item: 'shrink-0 basis-full md:basis-1/3 min-w-120 h-full min-h-16 flex flex-row gap-4 items-center justify-around',
        }"
      >
        <h4 class="text-2xl text-white font-black uppercase">
          {{ item }}
        </h4>

        <UIcon name="i-lucide-gift" class="shrink-0 size-10 text-white" />

        <!-- <img
          src="/sushi-heart.svg"
          alt=""
          class="w-10 h-auto opacity-90"
        > -->
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<string[]>([
  'Подарки участникам',
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
