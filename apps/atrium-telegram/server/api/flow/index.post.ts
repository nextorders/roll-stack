import { db } from '@roll-stack/database'
import { createFlowItemSchema } from '@roll-stack/schema'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createFlowItemSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const item = await db.flow.createItem({
      type: data.type,
      title: data.title,
      description: data.description,
      userId: event.context.user.id,
    })
    if (!item) {
      throw createError({
        statusCode: 500,
        message: 'Item not created',
      })
    }

    // Bot notification in chat
    // if (list.chat) {
    //   const bot = await repository.chat.findNotificationBot(list.chat.id)
    //   if (bot) {
    //     const text = `${event.context.user.name} ${event.context.user.surname} ${suffixByGender(['создал', 'создала'], event.context.user.gender)} задачу «${task.name}»`

    //     // Send message as bot
    //     await repository.chat.createMessage({
    //       chatId: list.chat.id,
    //       userId: bot.user.id,
    //       text,
    //     })
    //   }
    // }

    return {
      ok: true,
      result: item,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
