<template>
  <div class="relative overflow-hidden">
    <div class="-z-10 absolute inset-0 w-full h-full bg-black" />
    <div class="-z-10 absolute inset-0 w-full h-full bg-gradient-to-l from-[#ed1c24] to-[#ed1c24]/50" />

    <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="py-4 lg:py-12">
        <div
          ref="target"
          class="bg-default px-6 md:px-10 py-5 md:py-10 rounded-xl flex flex-col items-center"
          :class="{ 'motion-preset-slide-right': isVisible }"
        >
          <div class="flex flex-col gap-5 text-center">
            <h2 class="text-3xl sm:text-4xl text-pretty tracking-tight font-bold text-highlighted">
              <span class="text-[#ed1c24]">Получи в подарок</span> гайд по документообороту в заведении общепита сразу после регистрации
            </h2>
            <div class="text-lg sm:text-2xl/8 text-muted text-pretty">
              Вебинар начнется через:
            </div>
          </div>

          <div class="mt-5 md:px-4 flex flex-col items-center">
            <CountdownTimer />

            <UButton
              to="https://t.me/vebinar_cafe_start_bot"
              external
              variant="solid"
              color="secondary"
              size="xl"
              trailing-icon="simple-icons:telegram"
              :ui="{
                base: 'px-6 md:px-8 text-xl md:text-2xl font-bold w-full justify-center',
              }"
              class="mt-8 w-full justify-center"
            >
              <div>Зарегистрироваться на вебинар</div>
            </UButton>
          </div>
        </div>
      </div>

      <div class="hidden md:block mt-4 w-full h-full bg-cover motion-preset-oscillate-sm motion-duration-4000" style="background-image: url('/bg-countdown.png');" />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target)

const isVisible = ref(false)
watch(targetIsVisible, () => {
  if (!targetIsVisible.value) {
    return
  }

  isVisible.value = targetIsVisible.value
})
</script>
