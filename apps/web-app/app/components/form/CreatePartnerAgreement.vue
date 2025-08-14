<template>
  <UForm
    ref="form"
    :validate="createValidator(createPartnerAgreementSchema)"
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
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UPopover>
      <UFormField
        label="Дата заключения"
        name="concludedAt"
        required
      >
        <UInput
          :value="selectedConcludedAt ? df.format(selectedConcludedAt.toDate(getLocalTimeZone())) : ''"
          placeholder="Выберите дату"
          size="xl"
          class="w-full items-center justify-center cursor-pointer"
          :ui="{ trailing: 'pe-1.5' }"
        />
      </UFormField>

      <template #content>
        <UCalendar v-model="selectedConcludedAt" class="p-2" />
      </template>
    </UPopover>

    <UPopover>
      <UFormField
        label="Дата окончания"
        name="willEndAt"
      >
        <UInput
          :value="selectedWillEndAt ? df.format(selectedWillEndAt.toDate(getLocalTimeZone())) : ''"
          placeholder="Выберите дату"
          size="xl"
          class="w-full items-center justify-center cursor-pointer"
          :ui="{ trailing: 'pe-1.5' }"
        />
      </UFormField>

      <template #content>
        <UCalendar v-model="selectedWillEndAt" class="p-2" />
      </template>
    </UPopover>

    <UFormField
      label="Номер договора (внутренний)"
      name="internalId"
      required
    >
      <UInput
        v-model="state.internalId"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      label="Роялти, %"
      name="royalty"
      required
    >
      <UInputNumber
        v-model="state.royalty"
        orientation="vertical"
        :step="0.1"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      label="Мин. роялти, руб"
      name="minRoyaltyPerMonth"
      required
    >
      <UInputNumber
        v-model="state.minRoyaltyPerMonth"
        orientation="vertical"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      label="Паушальный взнос, руб"
      name="lumpSumPayment"
      required
    >
      <UInputNumber
        v-model="state.lumpSumPayment"
        orientation="vertical"
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
      :label="$t('common.create')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CreatePartnerAgreement } from '#shared/services/partner'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createPartnerAgreementSchema } from '#shared/services/partner'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const { partnerId, legalEntityId } = defineProps<{ partnerId: string, legalEntityId?: string }>()
const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()

const form = useTemplateRef('form')

const state = ref<Partial<CreatePartnerAgreement>>({
  concludedAt: undefined,
  willEndAt: undefined,
  internalId: undefined,
  royalty: undefined,
  minRoyaltyPerMonth: undefined,
  lumpSumPayment: undefined,
  comment: undefined,
  legalEntityId: legalEntityId ?? undefined,
})

const legalEntities = computed(() => partnerStore.legalEntities.map((legalEntity) => {
  return {
    label: legalEntity.name,
    value: legalEntity.id,
  }
}))

const selectedLegalEntity = ref(legalEntities.value.find((legalEntity) => legalEntity.value === legalEntityId))

watch(selectedLegalEntity, () => {
  state.value.legalEntityId = selectedLegalEntity.value?.value
})

const df = new DateFormatter('ru-RU', {
  dateStyle: 'long',
})

const selectedConcludedAt = shallowRef<CalendarDate | undefined>()
const selectedWillEndAt = shallowRef<CalendarDate | undefined>()

watch(selectedConcludedAt, () => {
  state.value.concludedAt = new Date(
    `${selectedConcludedAt.value?.toString()} 12:00:00`,
  ).toISOString()

  form.value?.clear()
})
watch(selectedWillEndAt, () => {
  state.value.willEndAt = new Date(
    `${selectedWillEndAt.value?.toString()} 12:00:00`,
  ).toISOString()

  form.value?.clear()
})

async function onSubmit(event: FormSubmitEvent<CreatePartnerAgreement>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/id/${partnerId}/agreement`, {
      method: 'POST',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.partner-agreement-created'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
