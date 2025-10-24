<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Договоры" />
      <CounterBadge :value="filteredAgreements.length" />
    </div>

    <div class="grid grid-cols-1 gap-2.5 items-center">
      <USelect
        v-model="sortedBy"
        size="xl"
        trailing-icon="i-lucide-arrow-down-wide-narrow"
        :ui="{
          base: '!ring-0',
        }"
        :items="[
          { label: 'По дате заключения (убывание)', value: 'concludedAtDesc' },
          { label: 'По дате заключения (возрастание)', value: 'concludedAtAsc' },
          { label: 'По дате окончания (убывание)', value: 'willEndAtDesc' },
          { label: 'По дате окончания (возрастание)', value: 'willEndAtAsc' },
        ]"
        class="motion-preset-slide-down"
      />

      <USelect
        v-model="filteredBy"
        size="xl"
        trailing-icon="i-lucide-funnel"
        :ui="{
          base: '!ring-0',
        }"
        :items="[
          { label: 'Все', value: 'all' },
          { label: 'Только активные', value: 'active' },
          { label: 'Только неактивные', value: 'inactive' },
          { label: 'Заканчиваются (6 месяцев) ', value: 'willEndSoon' },
        ]"
        class="motion-preset-slide-up"
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
          <PartnerAgreementCard :agreement-id="agreement.id" />
        </NuxtLink>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const partnerStore = usePartnerStore()

const sortedBy = ref<'concludedAtDesc' | 'concludedAtAsc' | 'willEndAtDesc' | 'willEndAtAsc'>('concludedAtDesc')

function sortByConcludedAtDesc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  const aTime = a.concludedAt ? new Date(a.concludedAt).getTime() : 0
  const bTime = b.concludedAt ? new Date(b.concludedAt).getTime() : 0
  return bTime - aTime
}

function sortByConcludedAtAsc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  const aTime = a.concludedAt ? new Date(a.concludedAt).getTime() : 0
  const bTime = b.concludedAt ? new Date(b.concludedAt).getTime() : 0
  return aTime - bTime
}

function sortByWillEndAtDesc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  const aTime = a.willEndAt ? new Date(a.willEndAt).getTime() : 0
  const bTime = b.willEndAt ? new Date(b.willEndAt).getTime() : 0
  return bTime - aTime
}

function sortByWillEndAtAsc(a: PartnerAgreementWithAllData, b: PartnerAgreementWithAllData) {
  const aTime = a.willEndAt ? new Date(a.willEndAt).getTime() : 0
  const bTime = b.willEndAt ? new Date(b.willEndAt).getTime() : 0
  return aTime - bTime
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

const filteredBy = ref<'all' | 'active' | 'inactive' | 'willEndSoon'>('all')

function filterByAll() {
  return true
}

function filterByActive(agreement: PartnerAgreementWithAllData) {
  return agreement.concludedAt && agreement.isActive
}

function filterByInactive(agreement: PartnerAgreementWithAllData) {
  return !agreement.concludedAt || !agreement.isActive
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
    case 'inactive':
      return filterByInactive
    case 'willEndSoon':
      return filterByWillEndSoon
  }
}

const filteredAgreements = computed(() => {
  const sorted = partnerStore.agreements.toSorted(chooseSortFunction())
  return sorted.filter(chooseFilterFunction())
})
</script>
