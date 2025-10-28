<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
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

      <div v-if="agreement?.comment" class="w-full text-sm/5 text-muted font-normal whitespace-pre-wrap wrap-break-word line-clamp-5">
        {{ agreement.comment }}
      </div>
    </Section>

    <NuxtLink v-if="partner" :to="`/partner/${partner.id}`">
      <PartnerActiveCard :partner-id="partner.id" />
    </NuxtLink>

    <div v-if="agreement?.files.length" class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between items-center">
        <SectionTitle title="Загруженные файлы" />
      </div>

      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="file of agreement.files"
          :key="file.id"
          :to="file.url"
          target="_blank"
        >
          <ActiveCard>
            <Section>
              <div class="flex flex-row gap-2 items-start">
                <UIcon
                  :name="getFileData(file).icon"
                  class="shrink-0 size-8 text-primary"
                />

                <p class="text-base/5 font-semibold">
                  {{ file.name }}
                </p>
              </div>
            </Section>
          </ActiveCard>
        </NuxtLink>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { PartnerAgreementFile } from '@roll-stack/database'
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
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === agreement.value?.legalEntity?.partners[0]?.id))

function getFileData(file: PartnerAgreementFile) {
  if (file.name.startsWith('Договор к')) {
    return {
      type: 'main',
      icon: 'i-lucide-book-text',
    }
  }
  if (file.name.startsWith('Акт о приеме')) {
    return {
      type: 'act',
      icon: 'i-lucide-file-text',
    }
  }
  if (file.name.startsWith('Патент')) {
    return {
      type: 'patent',
      icon: 'i-lucide-file-badge',
    }
  }
  if (file.name.startsWith('Заявление о расторжении')) {
    return {
      type: 'terminate',
      icon: 'i-lucide-file-x-2',
    }
  }
  if (file.name.startsWith('Заявление о приостановке')) {
    return {
      type: 'suspense',
      icon: 'i-lucide-file-clock',
    }
  }
  if (file.name.startsWith('График платежей')) {
    return {
      type: 'payments',
      icon: 'i-lucide-file-spreadsheet',
    }
  }

  return {
    type: 'unknown',
    icon: 'i-lucide-file',
  }
}
</script>
