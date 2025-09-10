<template>
  <div
    v-if="isCatalogPage"
    class="tg-safe-area tg-text-button bg-gradient-to-b from-indigo-950 to-indigo-700 motion-preset-slide-down"
  >
    <div class="px-4 py-4 max-w-[28rem] mx-auto tg-content-safe-area-top">
      <div class="pt-6 flex flex-row items-center gap-2">
        <UIcon name="i-lucide-moon" class="size-12 motion-preset-oscillate-sm motion-preset-seesaw motion-duration-3000" />

        <div class="flex flex-col">
          <h3 class="text-lg font-semibold">
            Мы сейчас закрыты
          </h3>
          <p>Работаем с 10:00 до 22:00</p>
        </div>
      </div>
    </div>

    <div class="tg-bg-secondary h-6 w-full rounded-t-lg overflow-hidden" />
  </div>
</template>

<script setup lang="ts">
const { isCatalogPage } = useNavigation()
</script>
