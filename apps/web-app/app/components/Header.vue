<template>
  <div class="h-16 shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5">
    <div class="flex items-center gap-2.5 md:gap-4 min-w-0">
      <HeaderMenuButton />

      <h1 class="flex items-center gap-1.5 font-medium text-lg text-highlighted truncate">
        {{ title }}
      </h1>
    </div>

    <div class="flex items-center shrink-0 gap-3">
      <slot />

      <UTooltip text="Поток">
        <UButton
          color="neutral"
          variant="ghost"
          square
          @click="isNotificationsOpened = true"
        >
          <UChip
            color="error"
            size="3xl"
            :text="flowStore.nowViewedItemsCount.toString()"
            :show="flowStore.nowViewedItemsCount > 0"
            :ui="{
              base: 'right-0 px-1.5 py-2 ring-2 tg-text-button font-bold motion-translate-y-loop-25 motion-duration-3500',
            }"
          >
            <UIcon name="i-lucide-waves" class="size-5 shrink-0" />
          </UChip>
        </UButton>
      </UTooltip>

      <UsersOnline />
    </div>
  </div>

  <template v-if="$slots.submenu">
    <div class="shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5 overflow-x-auto min-h-[49px]">
      <slot name="submenu" />
    </div>
  </template>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()

const { isNotificationsOpened } = useApp()

const flowStore = useFlowStore()
</script>
