<template>
  <div class="p-4">
    <h1>Привет, {{ userStore.name }}!</h1>
    <p>Id пользователя: {{ initDataState?.user?.id }}</p>
  </div>
</template>

<script setup lang="ts">
const { initDataState } = useTelegram()
const userStore = useUserStore()
</script>
