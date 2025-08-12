<template>
  <UForm
    :validate="createValidator(updateUserSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField :label="$t('common.name')" name="name">
        <UInput
          v-model="state.name"
          size="xl"
          class="w-full items-center justify-center"
        />
      </UFormField>

      <UFormField :label="$t('common.surname')" name="surname">
        <UInput
          v-model="state.surname"
          size="xl"
          class="w-full items-center justify-center"
        />
      </UFormField>
    </div>

    <UFormField :label="$t('common.email')" name="email">
      <UInput
        v-model="state.email"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.phone')" name="phone">
      <UInput
        v-model="state.phone"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.caption')" name="caption">
      <UInput
        v-model="state.caption"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.gender.title')" name="gender">
      <USelect
        v-model="state.gender"
        :items="getLocalizedGenderForSelect()"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

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
import type { UpdateUser } from '~~/shared/services/user'
import { updateUserSchema } from '~~/shared/services/user'

const { userId } = defineProps<{ userId: string }>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()
const userStore = useUserStore()
const user = userStore.find(userId)

const state = ref<Partial<UpdateUser>>({
  name: user?.name,
  surname: user?.surname,
  email: user?.email ?? undefined,
  phone: user?.phone ?? undefined,
  caption: user?.caption,
  gender: user?.gender,
})

async function onSubmit(event: FormSubmitEvent<UpdateUser>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/user/id/${user?.id}`, {
      method: 'PATCH',
      body: event.data,
    })

    await Promise.all([
      userStore.update(),
      partnerStore.update(),
    ])

    actionToast.success(toastId, t('toast.user-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
