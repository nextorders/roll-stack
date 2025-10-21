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
import { retrieveLaunchParams, themeParams } from '@tma.js/sdk-vue'

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

// App
const isDev = (retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV) ?? false
await init({
  debug: false,
  eruda: isDev,
  mockForMacOS: false,
})

// Telegram
useBackButton()

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
const client = useClientStore()
const channel = useChannelStore()
const menu = useMenuStore()

// Guard
await Promise.all([
  client.update(),
  client.updateCities(),
  channel.update(),
  menu.update(),
])
if (!client.id) {
  await navigateTo('/no-auth')
}

// Auto Update
let interval: NodeJS.Timeout

onMounted(async () => {
  await Promise.all([
    client.updateOnline(),
    client.updateLevels(),
  ])

  interval = setInterval(async () => {
    await Promise.all([
      client.update(),
      client.updateOnline(),
    ])
  }, 30000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
