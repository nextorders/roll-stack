<template>
  <UApp
    :locale="locales[locale]"
    :tooltip="{ delayDuration: 0 }"
    class="min-h-svh"
  >
    <NuxtLoadingIndicator :color="false" class="bg-primary h-[2px]" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  htmlAttrs: {
    lang,
    dir,
  },
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

// Init Stores
const user = useUserStore()
const task = useTaskStore()

// Guard
await user.update()
if (!user.id) {
  await navigateTo('/no-auth')
}

// Auto Update Online
let interval: NodeJS.Timeout

onMounted(async () => {
  await Promise.all([
    user.updateOnline(),
    user.update(),
    task.update(),
  ])

  interval = setInterval(async () => {
    await Promise.all([
      user.updateOnline(),
      user.update(),
      task.update(),
    ])
  }, 30000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
