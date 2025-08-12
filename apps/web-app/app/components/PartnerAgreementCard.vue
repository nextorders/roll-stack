<template>
  <UCard
    class="h-full"
    :class="[
      !agreement.isActive && 'opacity-75 grayscale-100',
    ]"
  >
    <div class="flex flex-col gap-3 group/list">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row items-start gap-2.5">
          <UIcon name="i-lucide-scroll-text" class="shrink-0 size-14 text-primary" />

          <UProgress
            v-model="agreementProgress"
            size="md"
            color="secondary"
            orientation="vertical"
            inverted
            class="h-14 py-1"
            :ui="{
              indicator: agreementProgress <= 15 && '!bg-error',
            }"
          />
        </div>

        <UTooltip :text="`Редактировать «Договор №${agreement.internalId}»`">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            class="size-10 justify-center opacity-0 group-hover/list:opacity-100"
            @click="modalUpdatePartnerAgreement.open({ agreementId: agreement.id })"
          />
        </UTooltip>
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        Договор №{{ agreement.internalId }}
      </h3>

      <div>
        <p v-if="agreement.concludedAt">
          Заключен: {{ format(new Date(agreement.concludedAt), 'd MMMM yyyy', { locale: ru }) }}
        </p>
        <p v-if="agreement.willEndAt">
          Действует до: {{ format(new Date(agreement.willEndAt), 'd MMMM yyyy', { locale: ru }) }}
        </p>
        <p>Роялти: {{ agreement.royalty }}%</p>
        <p>Мин. роялти: {{ agreement.minRoyaltyPerMonth }} ₽ / месяц</p>

        <p v-if="agreement.marketingFee">
          Маркетинговый сбор: {{ agreement.marketingFee }}%
        </p>
        <p v-if="agreement.minMarketingFeePerMonth">
          Мин. маркетинговый сбор: {{ agreement.minMarketingFeePerMonth }} ₽ / месяц
        </p>

        <p>Паушальный взнос: {{ agreement.lumpSumPayment }} ₽</p>
      </div>

      <p v-if="agreement.comment" class="text-muted">
        {{ agreement.comment }}
      </p>

      <div v-if="agreement.files.length" class="flex flex-col gap-1.5">
        <UButton
          v-for="file in agreement.files"
          :key="file.id"
          :to="file.url"
          external
          target="_blank"
          size="lg"
          variant="subtle"
          color="neutral"
          icon="i-lucide-file-symlink"
          :label="file.name"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { PartnerAgreement, PartnerAgreementFile } from '@roll-stack/database'
import { ModalUpdatePartnerAgreement } from '#components'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { agreement } = defineProps<{ agreement: PartnerAgreement & { files: PartnerAgreementFile[] } }>()

const overlay = useOverlay()
const modalUpdatePartnerAgreement = overlay.create(ModalUpdatePartnerAgreement)

const agreementProgress = computed(() => getAgreementProgressPercentLeft(agreement.concludedAt, agreement.willEndAt))
</script>
