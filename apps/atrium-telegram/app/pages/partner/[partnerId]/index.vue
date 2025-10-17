<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
      <div class="flex flex-row gap-2 items-center">
        <UIcon
          name="i-lucide-user"
          class="size-10 text-primary"
        />
      </div>

      <SectionTitle :title="`${partnerUser?.name} ${partnerUser?.surname}`" />

      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2 items-start text-base/5">
          <UIcon name="i-lucide-tag" class="shrink-0 size-5" /> {{ partner?.priceLevel }} уровень цен
        </div>

        <div class="flex flex-row gap-2 items-start text-base/5">
          <UIcon name="i-lucide-map" class="shrink-0 size-5" /> {{ partner?.city }}
        </div>
      </div>
    </Section>

    <div v-if="partner?.legalEntity" class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between items-center">
        <SectionTitle title="Юридическое лицо" />
      </div>

      <Section class="motion-preset-slide-left">
        <div class="flex flex-col gap-2.5">
          <div class="flex flex-row gap-2 items-center">
            <UIcon
              name="i-lucide-scale"
              class="size-10 text-primary"
            />
          </div>

          <h3 class="font-bold">
            {{ partner.legalEntity.name }}
          </h3>

          <div>
            <p v-if="partner.legalEntity.inn">
              ИНН {{ partner.legalEntity.inn }}
            </p>
            <p v-if="partner.legalEntity.ogrnip">
              ОГРНИП {{ partner.legalEntity.ogrnip }}
            </p>
          </div>
        </div>
      </Section>
    </div>

    <div v-if="partner?.legalEntity?.agreements.length" class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between items-center">
        <SectionTitle title="Договоры" />
      </div>

      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="agreement in partner.legalEntity.agreements"
          :key="agreement.id"
          :to="`/agreement/${agreement.id}`"
          class="motion-preset-slide-left"
        >
          <PartnerAgreementCard
            :agreement-id="agreement.id"
          />
        </NuxtLink>
      </div>
    </div>

    <div v-if="partner?.kitchens.length" class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between items-center">
        <SectionTitle title="Кухни" />
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="kitchen in partner.kitchens"
          :key="kitchen.id"
          class="motion-preset-slide-left"
        >
          <KitchenCard :kitchen="kitchen" />
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'partner-partnerId',
  canReturn: true,
})

const { params } = useRoute('partner-partnerId')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.partnerId))
const partnerUser = computed(() => partner.value?.users.find((user) => user.type === 'partner'))
</script>
