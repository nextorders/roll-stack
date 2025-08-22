<template>
  <div class="h-full p-4 rounded-lg border border-default group/list space-y-2.5">
    <div class="flex flex-row gap-2 items-center justify-between">
      <div class="flex flex-row gap-2.5 items-center">
        <h3 class="text-lg/5 font-bold">
          Ларец
        </h3>
      </div>
    </div>

    <div
      v-if="lockerStore.duplicates.length"
      class="w-full flex flex-col gap-3"
    >
      <LockerItemCard
        v-for="duplicate in lockerStore.duplicates"
        :key="duplicate.id"
        :duplicate="duplicate"
      />
    </div>
    <template v-else>
      <p class="text-base text-dimmed">
        Активных доступов нет
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
const lockerStore = useLockerStore()
</script>
