<template>
  <div class="flex flex-row gap-1.5 items-center motion-preset-slide-left">
    <UPopover
      v-for="file in files"
      :key="file.id"
      mode="hover"
      :content="{
        align: 'center',
        side: 'bottom',
        sideOffset: 8,
      }"
    >
      <ULink
        :to="file.url"
        external
        target="_blank"
      >
        <UIcon
          :name="getFileData(file).icon"
          class="size-5 hover:scale-110 duration-200"
          :class="[
            (isActive && getFileData(file).type === 'main') && 'text-secondary',
          ]"
        />
      </ULink>

      <template #content>
        <div class="h-auto w-56 p-4 flex flex-col gap-2">
          <UIcon :name="getFileData(file).icon" class="size-10" />

          <div class="flex flex-col gap-2.5">
            <h4 class="text-base/5">
              {{ file.name }}
            </h4>

            <UButton
              size="sm"
              variant="subtle"
              color="neutral"
              :to="file.url"
              icon="i-lucide-external-link"
              external
              target="_blank"
              class="w-fit"
              label="Открыть"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { PartnerAgreementFile } from '@roll-stack/database'

defineProps<{ files: PartnerAgreementFile[], isActive?: boolean }>()

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
