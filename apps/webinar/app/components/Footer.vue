<template>
  <!-- <USeparator
    icon="lucide-chef-hat"
    class="h-px mt-12"
  /> -->

  <UFooter :ui="{ top: 'border-b border-muted/50' }">
    <template #top>
      <UContainer>
        <div class="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 items-center justify-center">
          <div class="mx-auto md:mx-0 mb-2 md:mb-0">
            <Logo />
          </div>

          <UButton
            to="tel:79951234567"
            size="xl"
            color="neutral"
            variant="soft"
            icon="i-lucide-phone"
            label="+7 (995) 123-45-67"
            block
          />

          <UButton
            to="mailto:test@sushi-love.ru"
            size="xl"
            color="neutral"
            variant="soft"
            icon="i-lucide-mail"
            label="test@sushi-love.ru"
            block
          />

          <UButton
            to="https://fransh.sushi-love.ru"
            target="_blank"
            size="xl"
            color="neutral"
            variant="soft"
            icon="i-lucide-briefcase"
            label="Франшиза"
            block
          />
        </div>
      </UContainer>
    </template>

    <template #left>
      <p class="flex flex-row items-center gap-1">
        Создано с <UIcon name="i-fluent-emoji-flat:red-heart" class="size-5" /> © 2025, ООО "Суши Лав"
      </p>
    </template>

    <template #right>
      <SocialButtons />
    </template>
  </UFooter>
</template>
