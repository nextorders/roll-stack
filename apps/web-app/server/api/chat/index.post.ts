import { repository } from '@sushi-atrium/database'
import { type } from 'arktype'
import { createChatSchema } from '~~/shared/services/chat'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createChatSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    // Guard: Must be user as a member
    if (data.usersId.length === 0 && !data.usersId.includes(session.user.id)) {
      throw createError({
        statusCode: 400,
        message: 'Must be user as a member',
      })
    }

    const chat = await repository.chat.create(data)
    if (!chat) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create chat',
      })
    }

    // Add all bots as members too
    const bots = await repository.user.findBots()
    const botIds = bots.map((bot) => bot.id)
    data.usersId.push(...botIds)

    // Create members
    for (const userId of data.usersId) {
      await repository.chat.createMember({
        chatId: chat.id,
        userId,
      })
    }

    // Create default task list
    await repository.task.createList({
      name: 'Общий список',
      chatId: chat.id,
    })

    return {
      ok: true,
      result: chat,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
