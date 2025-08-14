<template>
  <Content>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
      <UCard>
        <div class="shrink-0 w-full flex flex-col gap-2">
          <UIcon name="i-lucide-store" class="size-14 text-primary" />

          <h2 class="text-xl md:text-xl/6 font-semibold">
            {{ kitchen?.address }}
          </h2>

          <p class="text-base/5">
            {{ kitchen?.city }}
          </p>
        </div>
      </UCard>

      <NuxtLink v-if="partner" :to="`/partner/${partner.id}`">
        <PartnerCard :partner="partner" />
      </NuxtLink>

      <div v-if="agreement" class="lg:col-span-2">
        <PartnerAgreementCard :agreement="agreement" />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('kitchen-id')

const partnerStore = usePartnerStore()
const kitchenStore = useKitchenStore()
const kitchen = computed(() => kitchenStore.kitchens.find((k) => k.id === params.id))
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === kitchen.value?.partnerId))

const agreement = computed(() => partnerStore.agreements.find((agreement) => agreement.id === kitchen.value?.agreementId))

useHead({
  title: t('common.kitchen'),
})
</script>
