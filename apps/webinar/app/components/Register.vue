<template>
  <div class="relative overflow-hidden">
    <div class="-z-10 absolute inset-0 w-full h-full bg-black" />
    <div class="-z-10 absolute inset-0 w-full h-full bg-gradient-to-r from-secondary to-secondary/50" />

    <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="hidden md:block mt-5 w-full h-full bg-cover motion-preset-wobble-sm motion-duration-4000" style="background-image: url('/bg-register.png');" />

      <div class="py-4 lg:py-12">
        <div
          ref="target"
          class="bg-default px-6 md:px-10 py-5 md:py-10 rounded-xl flex flex-col items-center"
          :class="{ 'motion-preset-slide-right': isVisible }"
        >
          <div class="flex flex-col gap-3.5">
            <h2 class="text-4xl sm:text-5xl text-pretty tracking-tight font-bold text-highlighted">
              Узнай все секреты бизнеса в сфере общепита и применяй их уже завтра!
            </h2>
            <div class="text-lg sm:text-2xl/7 text-muted text-pretty">
              Каждому, в конце вебинара, <span class="font-semibold">мы подарим “Пошаговую инструкцию по открытию своего заведения”.</span>
            </div>
          </div>

          <div class="mt-6 flex flex-col md:flex-row gap-x-6 gap-y-2">
            <h3 class="flex flex-row gap-2 items-center text-xl font-bold">
              <UIcon name="i-lucide-calendar" class="size-8 text-secondary" /> 30 октября 2025
            </h3>
            <h3 class="flex flex-row gap-2 items-center text-xl font-bold">
              <UIcon name="i-lucide-clock" class="size-8 text-secondary" /> 12:00-13:30 (МСК)
            </h3>
          </div>

          <UButton
            to="https://t.me/sign_up_for_webinars_bot"
            target="_blank"
            variant="solid"
            color="secondary"
            size="xl"
            trailing-icon="simple-icons:telegram"
            :ui="{
              base: 'px-6 md:px-8 md:py-6 text-xl md:text-2xl font-bold w-full justify-center',
            }"
            class="mt-4 w-full justify-center"
          >
            <div>Зарегистрироваться на вебинар</div>
          </UButton>
        </div>
      </div>
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
