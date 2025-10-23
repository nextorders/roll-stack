<template>
  <UApp
    :locale="locales[locale]"
    :tooltip="{ delayDuration: 0 }"
    :toaster="{
      position: 'top-center',
      class: 'mt-20',
    }"
  >
    <NuxtLoadingIndicator :color="false" class="bg-primary h-[2px]" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { themeParams } from '@tma.js/sdk-vue'

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  htmlAttrs: {
    lang,
    dir,
  },
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
  }],
})

// Telegram
const isDev = import.meta.env.DEV

init({
  debug: isDev,
  eruda: isDev,
  mockForMacOS: false,
}).then(() => {
  useBackButton()
})

// Fix system theme
const isDark = computed(() => themeParams.isDark())
const colorMode = useColorMode()
watch(colorMode, () => {
  colorMode.value = isDark.value ? 'dark' : 'light'

  const colorModeStorage = localStorage.getItem('color-mode')
  if (colorMode.value === 'system' || colorModeStorage === 'system') {
    localStorage.setItem('color-mode', colorMode.value)
  }
}, { immediate: true })

// Init Stores
const user = useUserStore()
const task = useTaskStore()
const ticket = useTicketStore()
const kitchen = useKitchenStore()
const flow = useFlowStore()
const partner = usePartnerStore()

// Guard
await user.update()
await user.updateOnline()
if (!user.id) {
  await navigateTo('/no-auth')
}

// Auto Update
let interval: NodeJS.Timeout

onMounted(async () => {
  await Promise.all([
    user.updateOnline(),
    user.update(),
    task.update(),
    ticket.update(),
    kitchen.update(),
    flow.update(),
    partner.update(),
  ])

  interval = setInterval(async () => {
    await Promise.all([
      user.updateOnline(),
      user.update(),
      task.update(),
      ticket.update(),
      kitchen.update(),
      flow.update(),
      partner.update(),
    ])
  }, 20000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
