<template>
  <PageContainer>
    <div class="flex flex-col gap-2.5">
      <div class="text-2xl/6 font-bold tracking-tight">
        Активные тикеты
      </div>
      <div class="flex flex-col gap-4">
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
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const ticketStore = useTicketStore()
</script>
