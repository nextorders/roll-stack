import type { BaseEventMessage, Status } from '@nextorders/queue'

export enum Events {
  ticketMessageCreated = 'ticketMessageCreated',
  notificationUserBeaconOnEpicCommentCreated = 'notificationUserBeaconOnEpicCommentCreated',
}

export type EventMessage = TicketMessageCreated | NotificationUserBeaconOnEpicCommentCreated

export type EventHandler = (msg: EventMessage) => Promise<Status>
export type EventMessageHandler<T = EventMessage['data']> = (data: T) => Promise<boolean>

export type EventHandlerMap = Record<EventMessage['event'], EventMessageHandler>

export interface TicketMessageCreated extends BaseEventMessage {
  type: typeof Events.ticketMessageCreated
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

export interface NotificationUserBeaconOnEpicCommentCreated extends BaseEventMessage {
  type: typeof Events.notificationUserBeaconOnEpicCommentCreated
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
