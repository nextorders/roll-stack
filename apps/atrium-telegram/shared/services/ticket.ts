import { type } from 'arktype'

export const createTicketMessageSchema = type({
  text: type('1 <= string <= 1500').describe('error.length.invalid'),
})
export type CreateTicketMessage = typeof createTicketMessageSchema.infer
