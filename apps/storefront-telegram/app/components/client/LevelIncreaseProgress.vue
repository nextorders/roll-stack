<template>
  <ClientPointsCardBottomBlock v-if="clientStore.nextLevel && clientStore.nextLevelAmount">
    <div>
      <h3 class="font-semibold">
        Повысьте кешбэк до {{ clientStore.nextLevel.cashback }}%
      </h3>
      <p class="text-sm/4">
        Закажите еще на {{ Intl.NumberFormat('ru').format(clientStore.nextLevelAmount) }} {{ channelStore.currencySign }}
      </p>
    </div>

    <UProgress
      v-model="clientStore.nextLevelProgressPercent"
      color="primary"
      :ui="{
        base: 'bg-primary/10',
      }"
    />
  </ClientPointsCardBottomBlock>
</template>

<script setup lang="ts">
const clientStore = useClientStore()
const channelStore = useChannelStore()
</script>
