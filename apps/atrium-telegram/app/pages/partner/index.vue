<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Партнеры" />
      <CounterBadge v-if="filteredPartners.length" :value="filteredPartners.length" />
      <CounterBadge v-if="typeof totalBalance === 'number'" :value="`${new Intl.NumberFormat().format(totalBalance)} ₽`" />
    </div>

    <div class="grid grid-cols-1 gap-2.5 items-center">
      <UInput
        v-model="search"
        size="xl"
        trailing-icon="i-lucide-search"
        placeholder="Найти..."
        :ui="{
          base: 'ring-0!',
        }"
        class="motion-preset-slide-down"
      />

      <USelect
        v-model="sortedBy"
        size="xl"
        trailing-icon="i-lucide-arrow-down-wide-narrow"
        :ui="{
          base: 'ring-0!',
        }"
        :items="[
          { label: 'По фамилии (возрастание)', value: 'nameAsc' },
          { label: 'По балансу (возрастание)', value: 'balanceAsc' },
          { label: 'По балансу (убывание)', value: 'balanceDesc' },
        ]"
        class="motion-preset-slide-down"
      />

      <USelect
        v-model="filteredBy"
        size="xl"
        trailing-icon="i-lucide-funnel"
        :ui="{
          base: 'ring-0!',
        }"
        :items="[
          { label: 'Все', value: 'all' },
          { label: 'Только должники', value: 'negativeBalance' },
        ]"
        class="motion-preset-slide-up"
      />
    </div>

    <div class="grid grid-cols-2 gap-2.5 items-start">
      <NuxtLink
        v-for="partner in filteredPartners"
        :key="partner.id"
        :to="`/partner/${partner.id}`"
        class="h-full motion-preset-slide-left"
      >
        <PartnerCard :partner="partner" />
      </NuxtLink>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { PartnerWithData } from '~/stores/partner'

const partnerStore = usePartnerStore()

const sortedBy = ref<'nameAsc' | 'balanceAsc' | 'balanceDesc'>('nameAsc')

function sortByNameAsc(a: PartnerWithData, b: PartnerWithData): number {
  return a.legalEntity?.name?.localeCompare(b.legalEntity?.name ?? '') ?? 0
}

function sortByBalanceAsc(a: PartnerWithData, b: PartnerWithData) {
  return a.balance - b.balance
}

function sortByBalanceDesc(a: PartnerWithData, b: PartnerWithData) {
  return b.balance - a.balance
}

function chooseSortFunction() {
  switch (sortedBy.value) {
    case 'nameAsc':
      return sortByNameAsc
    case 'balanceAsc':
      return sortByBalanceAsc
    case 'balanceDesc':
      return sortByBalanceDesc
  }
}

const search = ref('')

const filteredBy = ref<'all' | 'negativeBalance'>('all')

function filterByAll() {
  return true
}

function filterByNegativeBalance(partner: PartnerWithData) {
  return partner.balance < 0
}

function chooseFilterFunction() {
  switch (filteredBy.value) {
    case 'all':
      return filterByAll
    case 'negativeBalance':
      return filterByNegativeBalance
  }
}

const filteredPartners = computed(() => {
  const sorted = partnerStore.partners.toSorted(chooseSortFunction())
  const filtered = sorted.filter(chooseFilterFunction())

  if (!search.value) {
    // Show all
    return filtered
  }

  return filtered.filter((partner) => {
    return partner.legalEntity?.name?.toLowerCase().includes(search.value.toLowerCase()) ?? false
  })
})

const totalBalance = computed(() => filteredPartners.value.reduce((acc, partner) => acc + partner.balance, 0))
</script>
