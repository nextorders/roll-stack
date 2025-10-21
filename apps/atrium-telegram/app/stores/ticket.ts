import type { Ticket, TicketMessage, User } from '@roll-stack/database'
import { initData, useSignal } from '@tma.js/sdk-vue'

export type TicketWithData = Ticket & {
  messages: TicketMessage[]
  lastMessage: TicketMessage | null
  user: User
}

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref<TicketWithData[]>([])

  const ticketsWithoutAnswer = computed(() => tickets.value.filter((ticket) => ticket.lastMessage?.userId === ticket.userId))

  const initDataRaw = useSignal(initData.raw)

  async function update() {
    try {
      const data = await $fetch('/api/ticket/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      tickets.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    tickets,
    ticketsWithoutAnswer,

    update,
  }
})
