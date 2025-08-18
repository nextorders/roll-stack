<template>
  <UForm
    :validate="createValidator(updatePartnerLegalEntitySchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('common.title')"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        size="xl"
        placeholder="ИП ИВАНОВ ИВАН ИВАНОВИЧ"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      label="ИНН"
      name="inn"
      required
    >
      <UInput
        v-model="state.inn"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="ОГРНИП" name="ogrnip">
      <UInput
        v-model="state.ogrnip"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.comment')" name="comment">
      <UInput
        v-model="state.comment"
        size="xl"
        placeholder="Для внутреннего использования"
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
      :label="$t('common.update')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { UpdatePartnerLegalEntity } from '#shared/services/partner'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updatePartnerLegalEntitySchema } from '#shared/services/partner'

const { entityId } = defineProps<{
  entityId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()
const entity = computed(() => partnerStore.legalEntities.find((legalEntity) => legalEntity.id === entityId))

const state = ref<Partial<UpdatePartnerLegalEntity>>({
  name: entity.value?.name,
  inn: entity.value?.inn,
  ogrnip: entity.value?.ogrnip ?? undefined,
  comment: entity.value?.comment ?? undefined,
})

async function onSubmit(event: FormSubmitEvent<UpdatePartnerLegalEntity>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/legal/id/${entityId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.partner-legal-entity-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
