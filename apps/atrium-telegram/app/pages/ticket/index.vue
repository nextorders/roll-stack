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
  </PageContainer>
</template>

<script setup lang="ts">
const ticketStore = useTicketStore()
</script>
