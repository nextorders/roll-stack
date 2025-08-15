<template>
  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div v-if="partner?.legalEntity" class="lg:col-span-2">
        <PartnerLegalEntityCard :partner-id="partner?.id ?? ''" :entity="partner.legalEntity" />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))

useHead({
  title: t('app.partner-legal-entity.title'),
})
</script>
