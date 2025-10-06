<template>
  <UPageHero
    id="hero"
    orientation="horizontal"
    :ui="{
      container: 'lg:pt-24',
      body: 'flex flex-col gap-3.5',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-3.5">
        <h1 class="text-5xl sm:text-6xl text-pretty tracking-tight font-bold text-highlighted">
          Как открыть ресторан, кофейню или суши-бар с нуля и избежать ошибок
        </h1>
        <div class="text-lg sm:text-2xl/8 text-muted text-pretty">
          Весь алгоритм открытия за 1,5 часа
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2">
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
          base: 'px-6 md:px-8 text-xl md:text-2xl font-bold w-full md:w-fit justify-center',
        }"
        class="mt-4 w-full justify-center"
      >
        <div>Зарегистрироваться на вебинар</div>
      </UButton>

      <div class="mt-2 max-w-120 flex flex-row gap-3.5 items-center">
        <UIcon name="i-lucide-gift" class="shrink-0 size-12 text-secondary motion-preset-pulse motion-duration-2000" />
        <p class="text-base/5">
          Сразу <span class="font-bold">после регистрации получи</span> гайд по документообороту открытия своего заведения
        </p>
      </div>
    </template>

    <HeroVideo />
  </UPageHero>
</template>
