<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Партнеры" />
      <CounterBadge :value="filteredPartners.length" />
    </div>

    <div class="grid grid-cols-1 gap-2.5 items-center">
      <UInput
        v-model="search"
        size="xl"
        trailing-icon="i-lucide-search"
        placeholder="Найти..."
        :ui="{
          base: 'rounded-lg text-lg/5 font-bold ring-0',
        }"
        class="motion-preset-slide-down"
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
const partnerStore = usePartnerStore()

const search = ref('')

const filteredPartners = computed(() => {
  const filteredBySearch = partnerStore.partners.filter((partner) => {
    return partner.legalEntity?.name.toLowerCase().includes(search.value.toLowerCase())
  })

  return filteredBySearch
})
</script>
