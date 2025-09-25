<template>
  <div class="bg-accented">
    <UPageSection
      title="Получить готовый план"
      description="И ответы на все свои вопросы, от поиска помещения до первого заработка. Мероприятие будет доступно через:"
      headline="Не забудь!"
      orientation="horizontal"
      :ui="{
        title: 'text-center',
        description: 'text-center',
        headline: 'py-2 px-4 mx-auto w-fit bg-secondary text-white rounded-md motion-preset-oscillate-sm',
      }"
    >
      <template #body>
        <div class="flex flex-col items-center">
          <CountdownTimer />

          <UButton
            to="https://t.me/SLFranchiseBot"
            variant="solid"
            size="xl"
            label="Зарегистрироваться"
            icon="i-lucide-calendar-plus"
            class="mt-12 w-full justify-center"
          />
          <p class="px-6 mt-2 text-center text-sm">
            И сразу получить подарок: гайд по документообороту по открытию заведения в сфере общепита
          </p>
        </div>
      </template>
    </UPageSection>
  </div>
</template>
