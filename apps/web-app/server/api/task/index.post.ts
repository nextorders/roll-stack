import { createTaskSchema } from '#shared/services/task'
import { suffixByGender } from '#shared/utils/gender'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createTaskSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const task = await repository.task.create({
      name: data.name,
      description: data.description,
      date: data.date,
      performerId: data.performerId,
      listId: data.listId,
    })
    if (!task) {
      throw createError({
        statusCode: 500,
        message: 'Task not created',
      })
    }

    const list = await repository.task.findList(task.listId)
    if (!list) {
      throw createError({
        statusCode: 500,
        message: 'Task list not found',
      })
    }

    // Bot notification in chat
    if (list.chat) {
      const bot = await repository.chat.findNotificationBot(list.chat.id)
      if (bot) {
        const text = `${event.context.user.name} ${event.context.user.surname} ${suffixByGender(['создал', 'создала'], event.context.user.gender)} задачу «${task.name}»`

        // Send message as bot
        await repository.chat.createMessage({
          chatId: list.chat.id,
          userId: bot.user.id,
          text,
        })
      }
    }

    return {
      ok: true,
      result: task,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
