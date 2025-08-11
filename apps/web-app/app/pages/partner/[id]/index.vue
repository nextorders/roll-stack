<template>
  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-6">
      <UCard>
        <div class="shrink-0 w-full flex flex-col gap-2">
          <UIcon name="i-lucide-handshake" class="size-14 text-primary" />

          <h3 class="text-xl md:text-xl/6 font-semibold">
            {{ partner?.priceLevel }} уровень цен
          </h3>

          <p class="text-base/5">
            {{ partner?.city }}
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col gap-2.5">
          <div class="flex flex-row items-center gap-1.5">
            <PartnerPrestigeBadge
              :prestige="partner?.prestige ?? 0"
              size="lg"
              class="group-hover:scale-125 duration-200"
            />
          </div>

          <h3 class="text-xl md:text-xl/6 font-semibold">
            {{ t('app.menu.prestige') }}
          </h3>

          <p class="text-base/5">
            Может как укрепляться, так и утрачиваться в зависимости от действий Партнера, его достижений и общественного восприятия.
          </p>
        </div>
      </UCard>

      <UserCard v-if="partnerUser" :user="partnerUser" />

      <div class="lg:col-span-2">
        <PartnerLegalEntityCard :partner-id="partner?.id ?? ''" :entity="partner?.legalEntity" />
      </div>

      <div
        v-for="agreement in activeAgreements"
        :key="agreement.id"
        class="lg:col-span-2"
      >
        <PartnerAgreementCard :agreement="agreement" />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))

const partnerUser = computed(() => partner.value?.users.filter((user) => user.type === 'partner')[0])

const activeAgreements = computed(() => partner.value?.legalEntity?.agreements.filter((agreement) => agreement.isActive))

useHead({
  title: t('common.partner'),
})
</script>
