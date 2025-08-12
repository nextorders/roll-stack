<template>
  <UForm
    :validate="createValidator(updateActivityScheduleItemSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.title')" name="title">
      <UInput
        v-model="state.title"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        :rows="4"
        autoresize
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Период действия" name="period">
      <UInput
        v-model="state.period"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Условия" name="terms">
      <UTextarea
        v-model="state.terms"
        :rows="4"
        autoresize
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Цели и задачи" name="goal">
      <UTextarea
        v-model="state.goal"
        :rows="4"
        autoresize
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <div class="mt-3 flex flex-row gap-3">
      <UButton
        type="submit"
        variant="solid"
        color="secondary"
        size="xl"
        block
        :label="$t('common.update')"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { UpdateActivityScheduleItem } from '#shared/services/activity'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateActivityScheduleItemSchema } from '#shared/services/activity'

const { scheduleId, itemId } = defineProps<{
  scheduleId: string
  itemId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const activityStore = useActivityStore()
const schedule = computed(() => activityStore.schedules.find((s) => s.id === scheduleId))
const item = computed(() => schedule.value?.items.find((i) => i.id === itemId))

const state = ref<Partial<UpdateActivityScheduleItem>>({
  title: item.value?.title,
  description: item.value?.description ?? undefined,
  period: item.value?.period,
  terms: item.value?.terms ?? undefined,
  goal: item.value?.goal ?? undefined,
})

async function onSubmit(event: FormSubmitEvent<UpdateActivityScheduleItem>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/activity/schedule/item/id/${itemId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await activityStore.update()

    actionToast.success(toastId, t('toast.activity-schedule-item-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
