<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Партнеры" />
      <CounterBadge :value="partnerStore.partners.length" />
    </div>

    <div class="grid grid-cols-2 gap-2.5 items-start">
      <NuxtLink
        v-for="partner in partnerStore.partners"
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
</script>
