import type { BaseEventMessage } from '@nextorders/queue'

export enum Events {
  TICKET_MESSAGE_CREATED = 'ticketMessageCreated',
  OTHER_ACTION = 'otherAction',
}

export type EventMessage = BaseEventMessage<Events>

export interface TicketMessageCreated extends EventMessage {
  type: typeof Events.TICKET_MESSAGE_CREATED
  data: {
    ticketId: string
    ticketOwnerId: string
    messageId: string
    userId: string
    userName: string
    userSurname: string | undefined
    userText: string
  }
}
