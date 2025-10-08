<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UIcon
          name="i-lucide-scroll"
          class="size-10 text-primary"
        />

        <div v-if="agreement?.isActive" class="flex flex-row items-center gap-1.5 text-primary">
          <UIcon
            name="i-lucide-bookmark-check"
            class="size-10"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            Активный
          </p>
        </div>
      </div>

      <SectionTitle :title="`Договор № ${agreement?.internalId}`" />

      <div>
        {{ agreement?.legalEntity?.name }}
      </div>

      <div>
        <div v-if="agreement?.concludedAt" class="w-full text-base/5 font-normal">
          Заключен: {{ format(new Date(agreement.concludedAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>

        <div v-if="agreement?.willEndAt" class="w-full text-base/5 font-normal">
          Заканчивается: {{ format(new Date(agreement.willEndAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>
      </div>

      <div>
        <div v-if="agreement?.royalty" class="w-full text-base/5 font-normal">
          Роялти: {{ agreement.royalty }}%, минимум {{ agreement.minRoyaltyPerMonth }} ₽
        </div>

        <div v-if="agreement?.patentStatus" class="w-full text-base/5 font-normal">
          Роспатент: {{ getPatentStatus(agreement.patentStatus) }}
        </div>
      </div>

      <div v-if="agreement?.comment" class="w-full text-base/5 text-muted font-normal whitespace-pre-wrap break-words line-clamp-5">
        {{ agreement.comment }}
      </div>
    </Section>
  </PageContainer>
</template>

<script setup lang="ts">
import { getPatentStatus } from '#shared/utils/helpers'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

definePageMeta({
  name: 'agreement-agreementId',
  canReturn: true,
})

const { params } = useRoute('agreement-agreementId')

const partnerStore = usePartnerStore()
const agreement = computed(() => partnerStore.agreements.find((agreement) => agreement.id === params.agreementId))
</script>
