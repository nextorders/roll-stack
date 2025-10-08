<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Договоры" />
      <UBadge
        v-if="filteredAgreements.length"
        size="md"
        color="primary"
        variant="subtle"
        :label="filteredAgreements.length"
        class="min-w-8 justify-center"
      />
    </div>

    <div class="grid grid-cols-1 gap-2.5 items-center">
      <USelect
        v-model="sortedBy"
        size="xl"
        trailing-icon="i-lucide-arrow-down-wide-narrow"
        :items="[
          { label: 'По дате заключения (убывание)', value: 'concludedAtDesc' },
          { label: 'По дате заключения (возрастание)', value: 'concludedAtAsc' },
          { label: 'По дате окончания (убывание)', value: 'willEndAtDesc' },
          { label: 'По дате окончания (возрастание)', value: 'willEndAtAsc' },
        ]"
      />

      <USelect
        v-model="filteredBy"
        size="xl"
        trailing-icon="i-lucide-funnel"
        :items="[
          { label: 'Все', value: 'all' },
          { label: 'Только активные', value: 'active' },
          { label: 'Скоро окончатся (6 месяцев) ', value: 'willEndSoon' },
        ]"
      />
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

const sortedBy = ref<'concludedAtDesc' | 'concludedAtAsc' | 'willEndAtDesc' | 'willEndAtAsc'>('concludedAtDesc')

function sortByConcludedAtDesc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  return new Date(b.concludedAt ?? '').getTime() - new Date(a.concludedAt ?? '').getTime()
}

function sortByConcludedAtAsc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  return new Date(a.concludedAt ?? '').getTime() - new Date(b.concludedAt ?? '').getTime()
}

function sortByWillEndAtDesc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  return new Date(b.willEndAt ?? '').getTime() - new Date(a.willEndAt ?? '').getTime()
}

function sortByWillEndAtAsc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  return new Date(a.willEndAt ?? '').getTime() - new Date(b.willEndAt ?? '').getTime()
}

function chooseSortFunction() {
  switch (sortedBy.value) {
    case 'concludedAtDesc':
      return sortByConcludedAtDesc
    case 'concludedAtAsc':
      return sortByConcludedAtAsc
    case 'willEndAtDesc':
      return sortByWillEndAtDesc
    case 'willEndAtAsc':
      return sortByWillEndAtAsc
  }
}

const filteredBy = ref<'all' | 'active' | 'willEndSoon'>('all')

function filterByAll() {
  return true
}

function filterByActive(agreement: PartnerAgreementWithAllData) {
  return agreement.concludedAt && agreement.isActive
}

function filterByWillEndSoon(agreement: PartnerAgreementWithAllData) {
  const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000
  return (
    agreement.isActive
    && agreement.willEndAt
    && new Date(agreement.willEndAt).getTime() - new Date().getTime() < SIX_MONTHS
  )
}

function chooseFilterFunction() {
  switch (filteredBy.value) {
    case 'all':
      return filterByAll
    case 'active':
      return filterByActive
    case 'willEndSoon':
      return filterByWillEndSoon
  }
}

const filteredAgreements = computed(() => {
  const sorted = partnerStore.agreements.toSorted(chooseSortFunction())
  const filtered = sorted.filter(chooseFilterFunction())

  return filtered
})
</script>
