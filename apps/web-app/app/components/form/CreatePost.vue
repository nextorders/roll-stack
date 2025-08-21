<template>
  <UForm
    :validate="createValidator(createPostSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      label="Где размещается"
      name="type"
      required
    >
      <USelectMenu
        v-model="selectedType"
        :items="types"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UPopover>
        <UFormField
          label="Дата публикации"
          name="date"
          required
        >
          <UInput
            :value="selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : ''"
            placeholder="Выберите дату"
            size="xl"
            class="w-full items-center justify-center cursor-pointer"
            :ui="{ trailing: 'pe-1.5' }"
          />
        </UFormField>

        <template #content>
          <UCalendar v-model="selectedDate" class="p-2" />
        </template>
      </UPopover>

      <UFormField
        label="Время публикации"
        name="time"
        required
      >
        <UInput
          v-model="selectedTime"
          type="time"
          size="xl"
          class="w-full items-center justify-center"
        />
      </UFormField>
    </div>

    <UFormField label="Комментарий" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Для внутреннего использования, не попадет в итоговый материал"
        :rows="3"
        autoresize
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Тело поста" name="content">
      <UTextarea
        v-model="state.content"
        placeholder="Тут должен быть текст с мотивацией, но он потерялся"
        :rows="6"
        autoresize
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
      :label="$t('common.add')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CreatePost } from '#shared/services/post'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Post } from '@roll-stack/database'
import { createPostSchema } from '#shared/services/post'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const postStore = usePostStore()

const types = [
  { label: t('common.social.vk'), value: 'vk' as const },
  { label: t('common.social.telegram'), value: 'telegram' as const },
]
const selectedType = ref<{ label: string, value: Post['type'] }>()

watch(selectedType, () => {
  if (!selectedType.value) {
    return
  }

  state.value.type = selectedType.value.value
})

const df = new DateFormatter('ru-RU', {
  dateStyle: 'long',
})

const selectedDate = shallowRef<CalendarDate | undefined>()
const selectedTime = ref()

watch(selectedDate, () => rebuildDate())
watch(selectedTime, () => rebuildDate())

function rebuildDate() {
  if (!selectedDate.value || !selectedTime.value) {
    state.value.publishAt = undefined
    return
  }

  state.value.publishAt = new Date(
    `${selectedDate.value.toString()} ${selectedTime.value}`,
  ).toISOString()
}

const state = ref<Partial<CreatePost>>({
  description: undefined,
  content: undefined,
  type: undefined,
  publishAt: undefined,
  status: 'draft',
})

async function onSubmit(event: FormSubmitEvent<CreatePost>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch('/api/post', {
      method: 'POST',
      body: event.data,
    })

    await postStore.update()

    actionToast.success(toastId, t('toast.post-created'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
