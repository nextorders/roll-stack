<template>
  <PageContainer>
    <h1 class="text-2xl/5 font-bold tracking-tight">
      Меню
    </h1>

    <div class="flex flex-col gap-1">
      <UButton
        v-for="item in items"
        :key="item.label"
        active
        size="xl"
        color="neutral"
        variant="ghost"
        class="px-0 text-xl/5 font-semibold"
        :label="item.label"
        :to="item.to"
        @click="item.onClick"
      />
    </div>

    <div class="flex flex-col gap-1">
      <p class="font-medium">
        {{ channelStore.selectedKitchen?.address }}
      </p>
      <p class="text-sm text-muted">
        Ежедневно с 11:00 до 22:00
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <UButton
        :to="formattedToCall"
        color="neutral"
        variant="ghost"
        class="px-0 text-lg font-medium"
      >
        {{ formatted }}
      </UButton>
    </div>

    <div class="flex flex-row gap-2">
      <UIcon name="simple-icons:vk" class="size-8" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { parsePhoneNumberWithError } from 'libphonenumber-js'

const { vibrate } = useFeedback()
const channelStore = useChannelStore()

const tel = '79999999999'
const formatted = parsePhoneNumberWithError(tel, 'RU').format('INTERNATIONAL')
const formattedToCall = parsePhoneNumberWithError(tel, 'RU').format('RFC3966')

const items = ref([
  {
    label: 'Акции',
    to: '/menu',
    onClick: () => vibrate(),
  },
  {
    label: 'О нас',
    onClick: () => vibrate(),
  },
  {
    label: 'Франшиза',
    onClick: () => vibrate(),
  },
  {
    label: 'Бонусная программа',
    onClick: () => vibrate(),
  },
  {
    label: 'Частые вопросы',
    onClick: () => vibrate(),
  },
])
</script>
