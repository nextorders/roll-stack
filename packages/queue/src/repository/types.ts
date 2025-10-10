import type { BaseEventMap, BaseEventMessage, BaseEventMessageHandlerMap } from '@nextorders/queue'

export enum Events {
  ticketMessageCreated = 'ticketMessageCreated',
  notificationUserBeaconOnEpicCommentCreated = 'notificationUserBeaconOnEpicCommentCreated',
}

type EventMessage = TicketMessageCreated | NotificationUserBeaconOnEpicCommentCreated
type EventMap = BaseEventMap<EventMessage>

export type EventHandlerMap = Partial<BaseEventMessageHandlerMap<EventMap>>

type TicketMessageCreatedData = {
  ticketId: string
  ticketOwnerId: string
  messageId: string
  userId: string
  userName: string
  userSurname: string | undefined
  userText: string
}
export interface TicketMessageCreated extends BaseEventMessage<TicketMessageCreatedData> {
  event: typeof Events.ticketMessageCreated
}

type NotificationUserBeaconOnEpicCommentCreatedData = {
  userId: string
  senderName: string
  senderSurname: string
  title: string
  description: string
  epicId: string
  epicCommentId: string
}
export interface NotificationUserBeaconOnEpicCommentCreated extends BaseEventMessage<NotificationUserBeaconOnEpicCommentCreatedData> {
  event: typeof Events.notificationUserBeaconOnEpicCommentCreated
}
