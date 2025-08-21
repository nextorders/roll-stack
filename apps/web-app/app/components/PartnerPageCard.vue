<template>
  <UCard class="h-full group/list">
    <div class="shrink-0 w-full flex flex-col gap-2">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row items-start gap-2.5">
          <UIcon name="i-lucide-handshake" class="size-14 text-primary" />
        </div>

        <UTooltip text="Редактировать">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            class="size-10 justify-center opacity-0 group-hover/list:opacity-100 transition duration-200"
            @click="modalUpdatePartner.open({ partnerId: partner.id })"
          />
        </UTooltip>
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ partner?.priceLevel }} уровень цен
      </h3>

      <p class="text-base/5">
        {{ partner?.city }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Partner } from '@roll-stack/database'
import { ModalUpdatePartner } from '#components'

defineProps<{ partner: Partner }>()

const overlay = useOverlay()
const modalUpdatePartner = overlay.create(ModalUpdatePartner)
</script>
