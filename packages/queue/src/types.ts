export interface EventMessage {
  ['TicketMessageCreated']: {
    type: 'ticketMessageCreated'
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
  ['OtherAction']: {
    type: 'otherAction'
    data: any
  }
}
