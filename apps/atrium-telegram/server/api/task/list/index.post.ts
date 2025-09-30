import { createTaskListSchema } from '#shared/services/task'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createTaskListSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    // Guard: Must be user as a member
    if (data.usersId.length === 0 && !data.usersId.includes(event.context.user.id)) {
      throw createError({
        statusCode: 400,
        message: 'Must be user as a member',
      })
    }

    // Create chat first
    const chat = await db.chat.create({
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
    const bots = await db.user.findBots()
    const botIds = bots.map((bot) => bot.id)
    data.usersId.push(...botIds)

    // Create members
    for (const userId of data.usersId) {
      await db.chat.createMember({
        chatId: chat.id,
        userId,
      })
    }

    const list = await db.task.createList({
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
