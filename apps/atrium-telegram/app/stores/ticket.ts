import type { Ticket, TicketMessage, User } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

export type TicketWithData = Ticket & {
  messages: TicketMessage[]
  lastMessage: TicketMessage | null
  user: User
}

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref<TicketWithData[]>([])

  const initDataRaw = useSignal(_initDataRaw)

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

    update,
  }
})
