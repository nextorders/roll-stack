<template>
  <UCard class="h-full">
    <div class="flex flex-col gap-3 group/list">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row items-start gap-2.5">
          <UIcon name="i-lucide-scale" class="size-14 text-primary" />
        </div>

        <UTooltip :text="`Редактировать «${entity.name}»`">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            class="size-10 justify-center opacity-0 group-hover/list:opacity-100"
            @click="modalUpdatePartnerLegalEntity.open({ entityId: entity.id })"
          />
        </UTooltip>
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ entity.name }}
      </h3>

      <div>
        <p>ИНН {{ entity.inn }}</p>
        <p v-if="entity.ogrnip">
          ОГРНИП {{ entity.ogrnip }}
        </p>
      </div>

      <p v-if="entity.comment" class="text-muted">
        {{ entity.comment }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { PartnerLegalEntity } from '@roll-stack/database'
import { ModalUpdatePartnerLegalEntity } from '#components'

defineProps<{ entity: PartnerLegalEntity }>()

const overlay = useOverlay()
const modalUpdatePartnerLegalEntity = overlay.create(ModalUpdatePartnerLegalEntity)
</script>
