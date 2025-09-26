<template>
  <div class="w-full">
    <div
      v-if="!isVideoShown"
      class="shrink-0 w-full h-full bg-muted rounded-lg aspect-square flex flex-col items-center justify-center hover:scale-98 active:scale-95 duration-200 cursor-pointer motion-preset-slide-left"
      @click="isVideoShown = true"
    >
      <div class="py-4 px-6 flex flex-col gap-2 items-center justify-center text-muted bg-accented/25 rounded-lg">
        <UIcon name="i-lucide-play" class="size-18" />
        <h3 class="text-xl font-semibold">
          Посмотреть видео
        </h3>
      </div>
    </div>

    <video
      v-else
      controls
      autoplay
      class="mx-auto max-h-140 rounded-xl motion-preset-slide-right"
    >
      <source src="https://storage.yandexcloud.net/sushi-love-test/telegram/files/BAACAgIAAxkBAAOFaMwda7U9ddiws5ZJ4oIbaeSlw0YAAvWDAAJt32BKU94XDWZ9cCg2BA.mp4" type="video/mp4">
      Ваш браузер не поддерживает видео
    </video>
  </div>
</template>

<script setup lang="ts">
const isVideoShown = ref(false)
</script>
