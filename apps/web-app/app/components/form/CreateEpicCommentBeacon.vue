<template>
  <UForm
    :validate="createValidator(createBeaconSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <div class="flex flex-row gap-3 items-center text-muted">
      <UIcon name="i-lucide-bell-plus" class="shrink-0 size-6 text-muted" />
      <p class="text-base/5">
        Отметьте пользователей, которым хотите отправить уведомление
      </p>
    </div>

    <UFormField label="Получатели" name="members">
      <USelectMenu
        v-model="selectedMembers"
        :items="availableMembers"
        :avatar="selectedMembers[0]?.avatar"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        multiple
        size="xl"
        class="w-full"
      />
    </UFormField>

    <div class="mt-3 flex flex-row gap-3">
      <UButton
        type="submit"
        variant="solid"
        color="secondary"
        size="xl"
        block
        :label="$t('common.create')"
        :disabled="!state.usersId?.length"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateBeacon } from '~~/shared/services/notification'
import { createBeaconSchema } from '~~/shared/services/notification'

const { commentId } = defineProps<{
  commentId: string
}>()

const emit = defineEmits(['success', 'submitted'])

type FormMember = { label: string, value: string, avatar: { src: string | undefined, alt: string } }

const { t } = useI18n()
const actionToast = useActionToast()

const userStore = useUserStore()
const epicStore = useEpicStore()
const notificationStore = useNotificationStore()

const state = ref<Partial<CreateBeacon>>({
  usersId: [],
})

const availableMembers = computed(() => {
  const notMe = userStore.staff.filter((staff) => staff.id !== userStore.id)

  return notMe.map((staff) => ({
    label: `${staff.name} ${staff.surname}`,
    value: staff.id,
    avatar: {
      src: staff.avatarUrl ?? undefined,
      alt: '',
    },
  }))
})
const selectedMembers = ref<FormMember[]>(availableMembers.value.filter((member) => state.value.usersId?.includes(member.value)) ?? [])

watch(selectedMembers, () => {
  if (!selectedMembers.value) {
    return
  }

  state.value.usersId = selectedMembers.value?.map((member) => member?.value)
})

async function onSubmit(event: FormSubmitEvent<CreateBeacon>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/epic/comment/id/${commentId}/beacon`, {
      method: 'POST',
      body: event.data,
    })

    await Promise.all([
      epicStore.update(),
      userStore.update(),
      notificationStore.update(),
    ])

    actionToast.success(toastId, t('toast.beacon-created'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
