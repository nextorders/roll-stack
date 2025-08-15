<template>
  <Header :title="t('app.menu.our-staff')" />

  <Content>
    <template v-if="user.id">
      <div class="mb-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-8 gap-4.5">
        <NuxtLink
          v-for="staff in activeStaff"
          :key="staff.id"
          :to="`/staff/${staff.id}`"
        >
          <StaffCard :staff="staff" />
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <Loader />
    </template>
  </Content>
</template>

<script setup lang="ts">
const { t } = useI18n()

const user = useUserStore()

const activeStaff = computed(() => user.staff.filter((staff) => staff.surname))

useHead({
  title: t('app.menu.our-staff'),
})
</script>
