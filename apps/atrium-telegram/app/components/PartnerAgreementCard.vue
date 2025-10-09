<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-scroll" class="size-8 text-primary" />

        <div v-if="agreement.isActive" class="flex flex-row items-center gap-1.5 text-primary">
          <UIcon
            name="i-lucide-bookmark-check"
            class="size-8"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            Активный
          </p>
        </div>
      </div>

      <h3 class="text-xl/5 font-bold">
        № {{ agreement.internalId }}
      </h3>

      <div>
        {{ agreement.legalEntity?.name }}
      </div>

      <div>
        <div v-if="agreement.concludedAt" class="w-full text-base/5 font-normal">
          Заключен: {{ format(new Date(agreement.concludedAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>

        <div v-if="agreement.willEndAt" class="w-full text-base/5 font-normal">
          Заканчивается: {{ format(new Date(agreement.willEndAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>
      </div>

      <div v-if="agreement.comment" class="w-full text-base/5 text-muted font-normal whitespace-pre-wrap break-words line-clamp-5">
        {{ agreement.comment }}
      </div>

    <!-- <div class="flex justify-between items-center">
      <div class="flex flex-row gap-4">
        <div class="flex flex-row gap-1.5 items-center text-muted">
          <UIcon name="i-lucide-message-circle" class="size-5" />
          <p>{{ epic?.comments.length }}</p>
        </div>
      </div>

      <time
        :datetime="epic.createdAt"
        class="text-sm text-muted"
        v-text="format(new Date(epic.createdAt), 'от d MMMM yyyy', { locale: ru })"
      />
    </div> -->
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { PartnerAgreementWithAllData } from '~/stores/partner'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

defineProps<{
  agreement: PartnerAgreementWithAllData
}>()
</script>
