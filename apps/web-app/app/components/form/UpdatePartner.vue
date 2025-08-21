<template>
  <UForm
    :validate="createValidator(updatePartnerSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('app.partner-legal-entity.title')"
      name="legalEntityId"
      required
    >
      <USelectMenu
        v-model="selectedLegalEntity"
        :items="legalEntities"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      :label="$t('common.city')"
      name="city"
      required
    >
      <UInput
        v-model="state.city"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      :label="$t('app.price-level')"
      name="priceLevel"
      required
    >
      <UInputNumber
        v-model="state.priceLevel"
        orientation="vertical"
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
      :label="$t('common.update')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { UpdatePartner } from '#shared/services/partner'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updatePartnerSchema } from '#shared/services/partner'

const { partnerId } = defineProps<{
  partnerId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === partnerId))

const state = ref<Partial<UpdatePartner>>({
  city: partner.value?.city ?? undefined,
  priceLevel: partner.value?.priceLevel ?? undefined,
  legalEntityId: partner.value?.legalEntityId ?? undefined,
})

const legalEntities = computed(() => partnerStore.legalEntities.map((legalEntity) => {
  return {
    label: legalEntity.name,
    value: legalEntity.id,
  }
}))

const selectedLegalEntity = ref(legalEntities.value.find((legalEntity) => legalEntity.value === partner.value?.legalEntityId))

watch(selectedLegalEntity, (newValue) => {
  state.value.legalEntityId = newValue?.value
})

async function onSubmit(event: FormSubmitEvent<UpdatePartner>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/id/${partnerId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.partner-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
