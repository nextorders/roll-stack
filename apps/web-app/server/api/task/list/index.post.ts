import { repository } from '@sushi-atrium/database'
import { type } from 'arktype'
import { createTaskListSchema } from '~~/shared/services/task'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createTaskListSchema(body)
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

    const user = await repository.user.find(session.user.id)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Guard: Must be user as a member
    if (data.usersId.length === 0 && !data.usersId.includes(session.user.id)) {
      throw createError({
        statusCode: 400,
        message: 'Must be user as a member',
      })
    }

    // Create chat first
    const chat = await repository.chat.create({
      name: data.name,
      description: data.description,
    })
    if (!chat) {
      throw createError({
        statusCode: 500,
        message: 'Chat not created',
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

    const list = await repository.task.createList({
      name: data.name,
      chatId: chat.id,
    })
    if (!list) {
      throw createError({
        statusCode: 500,
        message: 'List not created',
      })
    }

    return {
      ok: true,
      result: list,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
