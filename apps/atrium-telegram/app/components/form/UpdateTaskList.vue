<template>
  <UForm
    :validate="createValidator(updateTaskListSchema)"
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

    <div class="mt-3 flex flex-row gap-3">
      <UButton
        type="submit"
        variant="solid"
        color="secondary"
        size="lg"
        block
        :label="$t('common.update')"
      />

      <UButton
        variant="soft"
        color="error"
        size="lg"
        icon="i-lucide-trash-2"
        class="aspect-square justify-center"
        @click="onDelete"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { UpdateTaskList } from '#shared/services/task'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateTaskListSchema } from '#shared/services/task'

const { listId } = defineProps<{
  listId: string
}>()

const emit = defineEmits(['success', 'submitted'])

type FormMember = { label: string, value: string, avatar: { src: string | undefined, alt: string } }

const { t } = useI18n()
const actionToast = useActionToast()

const userStore = useUserStore()
const taskStore = useTaskStore()
const list = computed(() => taskStore.lists.find((list) => list.id === listId))

const state = ref<Partial<UpdateTaskList>>({
  name: list.value?.name,
  description: list.value?.chat?.description ?? undefined,
  usersId: list.value?.chat?.members.map((member) => member.userId) ?? [],
})

const availableMembers = computed(() => userStore.staff.map((staff) => ({
  label: `${staff.name} ${staff.surname}`,
  value: staff.id,
  avatar: {
    src: staff.avatarUrl ?? undefined,
    alt: '',
  },
})))
const selectedMembers = ref<FormMember[]>(availableMembers.value.filter((member) => state.value.usersId?.includes(member.value)) ?? [])

watch(selectedMembers, () => {
  if (!selectedMembers.value) {
    return
  }

  state.value.usersId = selectedMembers.value?.map((member) => member?.value)
})

async function onSubmit(event: FormSubmitEvent<UpdateTaskList>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/list/id/${listId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await taskStore.update()

    actionToast.success(toastId, t('toast.task-list-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}

async function onDelete() {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/list/id/${listId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
    })

    await taskStore.update()

    actionToast.success(toastId, t('toast.task-list-deleted'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
