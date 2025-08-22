<template>
  <div class="w-full flex flex-row items-start gap-3">
    <UIcon
      name="i-lucide-key-round"
      class="size-5 text-muted/50"
    />

    <div class="flex flex-col gap-1 items-start text-left">
      <h4
        class="text-base/5 font-semibold line-clamp-3"
      >
        {{ duplicate.item.title }}
      </h4>
      <p
        v-if="duplicate.item.description"
        class="text-sm/4 text-neutral-500 line-clamp-2 group-hover/task:line-clamp-5 transition duration-200"
      >
        {{ duplicate.item.description }}
      </p>

      <div class="mt-1 flex flex-row gap-2">
        <UButton
          v-if="duplicate.item.login"
          variant="outline"
          color="neutral"
          size="sm"
          icon="i-lucide-copy"
          label="Скопировать логин"
          @click="copyToClipboard(duplicate.item.login)"
        />

        <UButton
          v-if="duplicate.item.password"
          variant="outline"
          color="neutral"
          size="sm"
          icon="i-lucide-copy"
          label="Скопировать пароль"
          @click="copyToClipboard(duplicate.item.password)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LockerItemDuplicateWithData } from '~/stores/locker'
import { UIcon } from '#components'

defineProps<{ duplicate: LockerItemDuplicateWithData }>()

const toast = useToast()

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'Успех',
    description: 'Текст скопирован в буфер обмена',
  })
}
</script>
