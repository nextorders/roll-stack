<template>
  <PageContainer>
    <NuxtLink
      v-for="ticket of ticketStore.tickets"
      :key="ticket.id"
      :to="`/ticket/${ticket.id}`"
      class="motion-preset-slide-left"
    >
      <TicketCard :ticket="ticket">
        {{ ticket.title }}
      </TicketCard>
    </NuxtLink>

    <div class="mt-16 flex flex-row justify-center">
      <UIcon name="i-lucide-route" class="size-8 text-dimmed/25" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const ticketStore = useTicketStore()
</script>
