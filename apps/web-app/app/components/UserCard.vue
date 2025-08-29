<template>
  <ActiveCard
    padding="none"
    class="flex flex-col gap-2.5 group"
  >
    <div class="relative">
      <img
        :src="user.avatarUrl ?? undefined"
        alt=""
        class="aspect-square w-full rounded-lg duration-200"
        :class="{ 'opacity-75 grayscale group-hover:grayscale-0 group-hover:opacity-100': imagesMode === 'grayscale' }"
      >

      <div class="absolute top-4 left-4">
        <UBadge
          color="neutral"
          variant="solid"
          size="lg"
          class="rounded-lg"
          :label="getUserTypeLabel(user.type)"
        />
      </div>
    </div>

    <div class="min-h-16 h-full px-4 flex flex-col gap-2.5">
      <div class="flex flex-col gap-1">
        <h3 class="text-base/5 font-bold">
          {{ user.name }} {{ user.surname }}
        </h3>

        <p class="text-sm/4 text-muted line-clamp-3">
          {{ user.caption }}
        </p>
      </div>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { User } from '@roll-stack/database'
import { getUserTypeLabel } from '#shared/utils/helpers'

defineProps<{
  user: User
}>()

const { imagesMode } = useApp()
</script>
