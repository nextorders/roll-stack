import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const ticketId = getRouterParam(event, 'ticketId')
    if (!ticketId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    return repository.ticket.listMessages(ticketId)
  } catch (error) {
    throw errorResolver(error)
  }
})
