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

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  htmlAttrs: {
    lang,
    dir,
  },
})

// Fix system theme
const colorMode = useColorMode()
watch(colorMode, () => {
  const colorModeStorage = localStorage.getItem('color-mode')

  if (colorMode.value === 'system' || colorModeStorage === 'system') {
    colorMode.value = 'light'
    localStorage.setItem('color-mode', 'light')
  }
})

// Init Stores
const user = useUserStore()
const partner = usePartnerStore()
const client = useClientStore()
const kitchen = useKitchenStore()
const menu = useMenuStore()
const product = useProductStore()
const chat = useChatStore()
const task = useTaskStore()
const ticket = useTicketStore()
const notification = useNotificationStore()
const post = usePostStore()
const print = usePrintStore()
const activity = useActivityStore()
const flow = useFlowStore()
const locker = useLockerStore()

await Promise.all([
  client.update(),
  partner.update(),
  kitchen.update(),
  menu.update(),
  product.update(),
  chat.update(),
  post.update(),
  print.update(),
  activity.update(),
  locker.update(),
])

// Auto Update Online
let interval: NodeJS.Timeout

onMounted(async () => {
  await Promise.all([
    user.updateOnline(),
    user.update(),
    task.update(),
    ticket.update(),
    notification.update(),
    flow.update(),
  ])

  interval = setInterval(async () => {
    await Promise.all([
      user.updateOnline(),
      user.update(),
      task.update(),
      ticket.update(),
      notification.update(),
      flow.update(),
    ])
  }, 30000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
