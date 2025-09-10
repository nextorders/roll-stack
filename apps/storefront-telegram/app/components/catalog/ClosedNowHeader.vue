<template>
  <div
    v-if="isCatalogPage && !channelStore.isKitchenOpened"
    class="tg-safe-area -mb-[calc(var(--tg-viewport-content-safe-area-inset-top)+var(--tg-viewport-safe-area-inset-top))] tg-text-button bg-gradient-to-b from-indigo-950 to-indigo-800 motion-preset-slide-down"
  >
    <div class="p-4 max-w-[28rem] mx-auto tg-content-safe-area-top">
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

    <div class="tg-bg-secondary h-4 w-full rounded-t-lg overflow-hidden" />
  </div>
</template>

<script setup lang="ts">
const { isCatalogPage } = useNavigation()

const channelStore = useChannelStore()
</script>
