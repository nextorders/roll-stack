<template>
  <Header :title="t('app.menu.our-partners')" />

  <Content>
    <template v-if="userStore.id">
      <div class="mb-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-8 gap-4.5">
        <NuxtLink
          v-for="partner in partnerStore.partners"
          :key="partner.id"
          :to="`/partner/${partner.id}`"
        >
          <PartnerCard :partner="partner" />
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <Loader />
    </template>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()

const userStore = useUserStore()
const partnerStore = usePartnerStore()

useHead({
  title: t('app.menu.our-partners'),
})
</script>
