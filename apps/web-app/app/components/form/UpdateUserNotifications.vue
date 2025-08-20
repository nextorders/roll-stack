<template>
  <UForm
    :state="state"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-4 items-center gap-4">
      <div class="col-span-2 text-muted leading-5">
        Куда отправляются
      </div>
      <div class="font-semibold place-self-center">
        Атриум
      </div>
      <div class="font-semibold place-self-center">
        Telegram
      </div>
    </div>

    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="grid grid-cols-4 items-center gap-4"
    >
      <div class="col-span-2 flex flex-col gap-1">
        <h4 class="font-semibold leading-4">
          {{ notification.title }}
        </h4>
        <p class="text-muted text-sm/4">
          {{ notification.description }}
        </p>
      </div>

      <div>
        <UCheckbox
          v-if="notification.atrium"
          v-model="selectedCheckboxes[notification.atrium as keyof typeof selectedCheckboxes]"
          size="xl"
          variant="list"
          color="secondary"
          class="justify-center"
        />
      </div>

      <div>
        <UCheckbox
          v-if="notification.telegram"
          v-model="selectedCheckboxes[notification.telegram as keyof typeof selectedCheckboxes]"
          size="xl"
          variant="list"
          color="secondary"
          class="justify-center"
        />
      </div>
    </div>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
      block
      class="mt-3"
      :label="$t('common.update')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { NotificationOption } from '@roll-stack/database'
import type { UpdateUser } from '~~/shared/services/user'

const { userId } = defineProps<{ userId: string }>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const userStore = useUserStore()
const user = userStore.find(userId)

const notifications = computed(() => [
  {
    id: '1',
    title: 'Задача выполнена',
    description: 'Приходит, когда участник команды закрыл задачу',
    atrium: 'task_completed_atrium',
    telegram: 'task_completed_telegram',
  },
])

const selectedCheckboxes = ref<Record<NotificationOption, boolean>>({
  task_completed_atrium: user?.notifications.includes('task_completed_atrium') ?? false,
  task_completed_telegram: user?.notifications.includes('task_completed_telegram') ?? false,
})

const state = ref<Partial<UpdateUser>>({
  notifications: user?.notifications,
})

watch(selectedCheckboxes, () => {
  // Each key to array, where true
  state.value.notifications = Object.keys(selectedCheckboxes.value).filter((key) => selectedCheckboxes.value[key as NotificationOption])
}, { deep: true })

async function onSubmit(event: FormSubmitEvent<UpdateUser>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/user/id/${user?.id}`, {
      method: 'PATCH',
      body: event.data,
    })

    await userStore.update()

    actionToast.success(toastId, t('toast.user-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
