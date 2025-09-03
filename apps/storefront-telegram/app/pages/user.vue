<template>
  <PageContainer>
    <div class="flex flex-col gap-1">
      <h1 class="text-xl/5 font-bold">
        {{ clientStore.fullName }}
      </h1>
      <p v-if="clientStore.formattedPhone" class="text-muted text-sm/5 font-medium">
        {{ clientStore.formattedPhone }}
      </p>
    </div>

    <UserPointsCard />

    <div class="flex flex-col gap-1">
      <UButtonGroup orientation="vertical" size="xl">
        <UButton
          color="neutral"
          variant="ghost"
          label="Мои заказы"
          icon="i-lucide-shopping-basket"
        />
        <UButton
          color="neutral"
          variant="ghost"
          label="Мои адреса"
          icon="i-lucide-map-pin-house"
        />
      </UButtonGroup>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const clientStore = useClientStore()
</script>
