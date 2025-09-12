<template>
  <ActiveCard>
    <UIcon name="i-lucide-clipboard-check" class="size-8 text-primary" />

    <h3 class="text-lg/5 font-bold">
      {{ item.title }}
    </h3>

    <div class="w-full text-sm/4 font-normal whitespace-pre-wrap break-words line-clamp-16">
      {{ item.description }}
    </div>

    <div class="flex justify-between items-center">
      <div class="flex flex-row gap-4">
        <div class="flex flex-row gap-1.5 items-center text-muted">
          <UIcon name="i-lucide-message-circle" class="size-5" />
          <p>{{ item?.comments.length }}</p>
        </div>
      </div>

      <time
        :datetime="item.createdAt"
        class="text-sm text-muted"
        v-text="format(new Date(item.createdAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
      />
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

defineProps<{
  item: FlowItemWithData
}>()
</script>
