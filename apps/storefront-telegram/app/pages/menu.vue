<template>
  <PageContainer>
    <div class="flex flex-col gap-2">
      <UButton
        v-for="item in items"
        :key="item.label"
        active
        size="xl"
        color="neutral"
        variant="ghost"
        class="px-0 pt-0 text-xl/5 font-semibold"
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
        external
        variant="ghost"
        color="primary"
        class="p-0 text-lg font-medium"
        :label="formatted"
      />
    </div>

    <div class="flex flex-row gap-2">
      <UButton
        variant="ghost"
        to="https://vk.com/sushiloveru"
        color="neutral"
        size="xl"
        icon="simple-icons:vk"
        class="p-0"
        :ui="{
          leadingIcon: 'size-8',
        }"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { parsePhoneNumberWithError } from 'libphonenumber-js'

const { vibrate } = useFeedback()
const channelStore = useChannelStore()

const tel = '79959999999'
const formatted = parsePhoneNumberWithError(tel, 'RU').format('INTERNATIONAL')
const formattedToCall = `tel:+${tel}`

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
