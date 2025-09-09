<template>
  <PageContainer>
    <div class="flex flex-col gap-2">
      <UButton
        v-for="item in items"
        :key="item.label"
        size="xl"
        color="neutral"
        variant="ghost"
        :label="item.label"
        :to="item.to"
        :ui="{
          base: 'px-0 pt-0 text-2xl/6 font-semibold',
        }"
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
        variant="ghost"
        color="primary"
        class="p-0 text-lg font-semibold"
        :label="formatted"
        @click="handleCall()"
      />
    </div>

    <div class="flex flex-row gap-2">
      <UButton
        variant="ghost"
        to="https://vk.com/sushiloveru"
        target="_blank"
        color="primary"
        size="xl"
        icon="simple-icons:vk"
        class="p-0"
        :ui="{
          leadingIcon: 'size-8',
        }"
        @click="vibrate()"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { openLink } from '@telegram-apps/sdk-vue'
import { parsePhoneNumberWithError } from 'libphonenumber-js'

const { vibrate } = useFeedback()
const channelStore = useChannelStore()

const tel = '79959999999'
const formatted = parsePhoneNumberWithError(tel, 'RU').format('INTERNATIONAL')
const formattedToCall = `tel:+${tel}`

async function handleCall() {
  vibrate()

  // Call phone number on click
  if (openLink.isAvailable()) {
    openLink(formattedToCall, {
      tryInstantView: true,
    })
  }
}

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
