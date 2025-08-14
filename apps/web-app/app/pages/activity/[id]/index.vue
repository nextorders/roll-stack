<template>
  <Header :title="schedule?.title ?? t('app.menu.activity-schedule')" />

  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <ActivityScheduleItemCard
        v-for="item in schedule?.items"
        :key="item.id"
        :item="item"
      />
    </div>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('activity-id')

const activityStore = useActivityStore()
const schedule = computed(() => activityStore.schedules.find((s) => s.id === params.id))

useHead({
  title: t('app.menu.activity-schedule'),
})
</script>
