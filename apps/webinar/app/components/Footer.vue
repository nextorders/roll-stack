<template>
  <UFooter :ui="{ top: 'border-b border-muted/50' }">
    <template #top>
      <UContainer class="max-w-2xl">
        <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center">
          <UButton
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            :target="item.target"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="item.icon"
            :label="item.label"
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

<script setup lang="ts">
const items = ref([
  {
    to: 'mailto:test@sushi-love.ru',
    label: 'test@sushi-love.ru',
    icon: 'i-lucide-mail',
  },
  {
    to: 'https://fransh.sushi-love.ru',
    target: '_blank',
    label: 'Франшиза',
    icon: 'i-lucide-briefcase',
  },
])
</script>
