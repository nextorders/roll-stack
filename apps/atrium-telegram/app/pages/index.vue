<template>
  <PageContainer :back="false">
    <h1>Привет, {{ userStore.name }}!</h1>
    <p>Id пользователя: {{ userStore.initDataState?.user?.id }}</p>
  </PageContainer>
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>
