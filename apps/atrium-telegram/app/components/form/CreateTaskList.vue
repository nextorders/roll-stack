<template>
  <UForm
    :validate="createValidator(createTaskListSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.title')" name="name">
      <UInput
        v-model="state.name"
        size="lg"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.short-description')" name="description">
      <UInput
        v-model="state.description"
        placeholder="Для чего создан и что в нем будет"
        size="lg"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Участники" name="members">
      <USelectMenu
        v-model="selectedMembers"
        :items="availableMembers"
        :avatar="selectedMembers[0]?.avatar"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        multiple
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="lg"
      block
      class="mt-3"
      :label="$t('common.create')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CreateTaskList } from '#shared/services/task'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createTaskListSchema } from '#shared/services/task'

const emit = defineEmits(['success', 'submitted'])

type FormMember = { label: string, value: string, avatar: { src: string | undefined, alt: string } }

const { t } = useI18n()
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const userStore = useUserStore()
const taskStore = useTaskStore()

const state = ref<Partial<CreateTaskList>>({
  name: undefined,
  description: undefined,
  usersId: [userStore.id as string],
})

const availableMembers = computed(() => userStore.staff.map((staff) => ({
  label: `${staff.name} ${staff.surname}`,
  value: staff.id,
  avatar: {
    src: staff.avatarUrl ?? undefined,
    alt: '',
  },
})))
const selectedMembers = ref<FormMember[]>([availableMembers.value.find((member) => member.value === userStore.id) as FormMember])

watch(selectedMembers, () => {
  state.value.usersId = selectedMembers.value.map((member) => member.value)
})

async function onSubmit(event: FormSubmitEvent<CreateTaskList>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch('/api/task/list', {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      userStore.update(),
      taskStore.update(),
    ])

    actionToast.success(toastId, t('toast.task-list-created'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
