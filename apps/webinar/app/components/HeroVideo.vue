<template>
  <div class="w-full">
    <div
      v-if="!isVideoShown"
      class="shrink-0 p-4 w-full h-full bg-secondary-500 rounded-lg aspect-square bg-cover flex flex-col items-end justify-start hover:scale-98 active:scale-95 duration-200 cursor-pointer motion-preset-slide-left"
      style="background-image: url('/video-preview.jpg')"
      @click="isVideoShown = true"
    >
      <div class="py-4 px-4 flex flex-col gap-2 items-center justify-center text-secondary bg-white rounded-lg motion-preset-oscillate-sm motion-duration-3000">
        <UIcon name="i-lucide-play" class="size-14" />
        <h3 class="text-lg font-semibold">
          Посмотреть
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
