<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Договоры" />
      <UBadge
        v-if="filteredAgreements.length"
        size="sm"
        color="primary"
        variant="soft"
        class="min-w-6 justify-center"
      >
        {{ filteredAgreements.length }}
      </UBadge>
    </div>

    <div class="flex flex-col gap-2.5">
      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="agreement in filteredAgreements"
          :key="agreement.id"
          :to="`/agreement/${agreement.id}`"
          class="motion-preset-slide-left"
        >
          <PartnerAgreementCard :agreement="agreement" />
        </NuxtLink>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const partnerStore = usePartnerStore()

const filteredAgreements = computed(() => partnerStore.agreements.toSorted((a, b) => new Date(b.concludedAt ?? '').getTime() - new Date(a.concludedAt ?? '').getTime()))
</script>
