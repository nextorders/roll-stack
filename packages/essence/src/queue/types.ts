import type { BaseEventMessage } from '@nextorders/queue'

export enum Events {
  TICKET_MESSAGE_CREATED = 'ticketMessageCreated',
  NOTIFICATION_USER_BEACON_ON_EPIC_COMMENT_CREATED = 'notificationUserBeaconOnEpicCommentCreated',
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

export interface NotificationUserBeaconOnEpicCommentCreated extends EventMessage {
  type: typeof Events.NOTIFICATION_USER_BEACON_ON_EPIC_COMMENT_CREATED
  data: {
    userId: string
    senderName: string
    senderSurname: string
    title: string
    description: string
    epicId: string
    epicCommentId: string
  }
}
