<template>
  <ActiveCard class="w-full flex flex-col gap-3.5">
    <UIcon name="i-lucide-crown" class="size-8 text-primary" />

    <h3 class="text-lg/5 font-bold">
      {{ epic.title }}
    </h3>

    <div class="w-full text-base/5 text-muted/50 whitespace-pre-wrap break-words line-clamp-3">
      {{ epic.description }}
    </div>

    <div class="flex justify-between items-center">
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
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { EpicWithData } from '~/stores/epic'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

defineProps<{
  epic: EpicWithData
}>()
</script>
