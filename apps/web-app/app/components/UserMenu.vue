<template>
  <UDropdownMenu
    v-if="userStore.id"
    size="lg"
    :items="userMenuItems"
    :search-input="false"
    :content="{ side: 'top', align: 'center' }"
    :ui="{ content: 'w-64' }"
  >
    <UButton
      :avatar="{ src: userStore.avatarUrl ?? undefined }"
      :ui="{ trailingIcon: 'text-dimmed' }"
      :label="userStore.fullName ?? t('common.colleague')"
      block
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-ellipsis-vertical"
      class="text-base"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { ModalUpdateUser } from '#components'

const { clear, fetch: refreshSession } = useUserSession()
const { t } = useI18n()
const colorMode = useColorMode()
const app = useApp()

const userStore = useUserStore()

async function signOut() {
  await clear()
  await refreshSession()
  await navigateTo('/sign-in')
}

const overlay = useOverlay()
const modalUpdateUser = overlay.create(ModalUpdateUser)

const userMenuItems = computed(() => [
  {
    label: userStore.fullName ?? t('common.colleague'),
    type: 'label' as const,
    avatar: {
      src: userStore.avatarUrl ?? undefined,
    },
  },
  {
    type: 'separator' as const,
  },
  {
    label: 'Редактировать профиль',
    type: 'link' as const,
    icon: 'lucide:edit',
    onClick() {
      modalUpdateUser.open({ userId: userStore.id })
    },
  },
  {
    label: 'Изображения',
    icon: 'lucide:images',
    children: [
      {
        label: 'Цветные',
        type: 'checkbox' as const,
        icon: 'lucide:palette',
        checked: app.imagesMode.value === 'color',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            app.imagesMode.value = 'color'
          }
        },
      },
      {
        label: 'Черно-белые',
        type: 'checkbox' as const,
        icon: 'lucide:eclipse',
        checked: app.imagesMode.value === 'grayscale',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            app.imagesMode.value = 'grayscale'
          }
        },
      },
    ],
  },
  {
    label: t('common.color-mode.title'),
    icon: 'lucide:sun-moon',
    children: [
      {
        label: t('common.color-mode.light'),
        type: 'checkbox' as const,
        icon: 'lucide:sun-dim',
        checked: colorMode.preference === 'light',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            colorMode.preference = 'light'
          }
        },
      },
      {
        label: t('common.color-mode.dark'),
        type: 'checkbox' as const,
        icon: 'lucide:moon',
        checked: colorMode.preference === 'dark',
        onUpdateChecked(checked: boolean) {
          if (checked) {
            colorMode.preference = 'dark'
          }
        },
      },
    ],
  },
  {
    type: 'separator' as const,
  },
  {
    label: t('common.sign-out'),
    type: 'link' as const,
    icon: 'lucide:log-out',
    onSelect: signOut,
  },
])
</script>
