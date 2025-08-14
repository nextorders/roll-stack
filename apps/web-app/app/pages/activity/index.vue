<template>
  <Header :title="t('app.menu.activity-schedules')" />

  <Content>
    <div class="mb-20 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4.5">
      <NuxtLink
        v-for="schedule in activityStore.schedules"
        :key="schedule.id"
        :to="`/activity/${schedule.id}`"
      >
        <ActivityScheduleCard :schedule="schedule" />
      </NuxtLink>
    </div>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()

const activityStore = useActivityStore()

useHead({
  title: t('app.menu.activity-schedules'),
})
</script>
