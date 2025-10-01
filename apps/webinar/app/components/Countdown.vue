<template>
  <div class="bg-elevated bg-cover" style="background-image: url('/countdown-background.jpg');">
    <UPageSection
      title="Получить готовый план"
      description="И ответы на все свои вопросы, от поиска помещения до первого заработка. Мероприятие будет доступно через:"
      headline="Не забудь!"
      orientation="horizontal"
      :ui="{
        title: 'text-center',
        description: 'text-center',
        headline: 'py-2 px-4 mx-auto w-fit bg-secondary text-white rounded-md motion-preset-oscillate-sm',
        wrapper: 'bg-default px-6 py-5 rounded-xl',
      }"
    >
      <template #body>
        <div class="md:px-4 flex flex-col items-center">
          <CountdownTimer />

          <UButton
            to="https://t.me/SLFranchiseBot"
            variant="solid"
            color="orange"
            size="xl"
            label="Зарегистрироваться"
            icon="i-lucide-calendar-plus"
            :ui="{
              base: 'bg-[#f57e20] text-white text-xl font-bold',
            }"
            class="mt-8 w-full justify-center"
          />
          <p class="px-6 mt-2 text-center text-base/5">
            И сразу получить подарок: гайд по документообороту по открытию заведения в сфере общепита
          </p>
        </div>
      </template>
    </UPageSection>
  </div>
</template>
