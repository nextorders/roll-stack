<template>
  <UForm
    :validate="createValidator(uploadMediaSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.photo')" name="file">
      <UInput
        ref="fileRef"
        type="file"
        accept="image/*"
        size="xl"
        class="w-full items-center justify-center"
        @change="onFileChange"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
      block
      class="mt-3"
      :label="$t('common.upload')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { UploadMedia } from '#shared/services/media'
import type { FormSubmitEvent } from '@nuxt/ui'
import { uploadMediaSchema } from '#shared/services/media'

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const userStore = useUserStore()

const state = ref<Partial<UploadMedia>>({
  file: undefined,
})

const fileRef = ref<HTMLInputElement>()

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) {
    return
  }

  state.value.file = input.files[0]
}

async function onSubmit(event: FormSubmitEvent<UploadMedia>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    const formData = new FormData()
    formData.append('file', event.data.file)

    const { public: publicEnv } = useRuntimeConfig()

    await $fetch(`${publicEnv.coreApiUrl}/user/id/${userStore.id}/image`, {
      method: 'POST',
      body: formData,
    })

    await userStore.update()

    actionToast.success(toastId, t('toast.photo-loaded'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
