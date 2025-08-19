<template>
  <UForm
    v-if="!telegramUser"
    :validate="createValidator(attachTelegramSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <h3 class="text-highlighted text-lg/5 font-semibold">
      "Суши Атриум Бот"
    </h3>

    <UButton
      variant="subtle"
      color="info"
      size="md"
      label="@sushi_atrium_bot"
      href="https://t.me/sushi_atrium_bot"
      icon="simple-icons:telegram"
      target="_blank"
      class="w-fit"
    />

    <p>
      Откройте бота в Telegram и нажмите кнопку "Начать". Или используйте команду "/start". Бот отправит Ключ доступа - введите его в поле ниже.
    </p>

    <UFormField
      :label="t('common.access-key')"
      name="accessKey"
      required
    >
      <UInput
        v-model="state.accessKey"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
      block
      class="mt-3"
      :label="$t('common.attach')"
    />
  </UForm>

  <div v-else>
    <p>Telegram успешно привязан!</p>
  </div>
</template>

<script setup lang="ts">
import type { AttachTelegram } from '#shared/services/telegram'
import type { FormSubmitEvent } from '@nuxt/ui'
import { attachTelegramSchema } from '#shared/services/telegram'

const { userId, botId } = defineProps<{
  userId: string
  botId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const userStore = useUserStore()
const user = userStore.find(userId)
const telegramUser = computed(() => user?.telegramUsers.find((telegramUser) => telegramUser.botId === botId && telegramUser.userId === userId))

const state = ref<AttachTelegram>({
  accessKey: '',
  botId,
})

async function onSubmit(event: FormSubmitEvent<AttachTelegram>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/user/id/${userId}/telegram`, {
      method: 'POST',
      body: event.data,
    })

    await userStore.update()

    actionToast.success(toastId, t('toast.telegram-attached'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
