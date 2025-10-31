<template>
  <div class="grid grid-cols-2 gap-2">
    <NuxtLink to="/point">
      <ActiveCard>
        <ProspectivePoints :points="userStore.prospectivePoints" />
      </ActiveCard>
    </NuxtLink>
    <ProspectiveDays :created-at="userStore.createdAt as string" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>
