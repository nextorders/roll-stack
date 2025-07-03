import type { Task, User } from '@sushi-atrium/database'
import { repository } from '@sushi-atrium/database'
import { type } from 'arktype'
import { updateTaskSchema } from '~~/shared/services/task'
import { suffixByGender } from '~~/shared/utils/gender'

export default defineEventHandler(async (event) => {
  try {
    const taskId = getRouterParam(event, 'taskId')
    if (!taskId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updateTaskSchema(body)
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

    const task = await repository.task.find(taskId)
    if (!task) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }

    const list = await repository.task.findList(task.listId)
    if (!list) {
      throw createError({
        statusCode: 500,
        message: 'Task list not found',
      })
    }

    const canEdit = list.chat?.members.some((member) => member.userId === session.user?.id)

    // Guard: if don't have access
    if (!canEdit) {
      throw createError({
        statusCode: 403,
        message: 'Task is private',
      })
    }

    const updatedTask = await repository.task.update(taskId, data)
    if (!updatedTask) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }

    const updatedPerformer = updatedTask.performerId ? await repository.user.find(updatedTask.performerId) : undefined

    // Bot notification in chat
    if (list.chat) {
      const bot = await repository.chat.findNotificationBot(list.chat.id)
      if (bot) {
        const text = prepareBotMessage(user, task, updatedTask, updatedPerformer)

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
      result: updatedTask,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})

function prepareBotMessage(author: User, oldTask: Task, updatedTask: Task, updatedPerformer?: User) {
  let text = `${author.name} ${author.surname} ${suffixByGender(['обновил', 'обновила'], author.gender)} задачу «${updatedTask.name}»`

  if (oldTask.description !== updatedTask.description) {
    text += `\n💬 ${updatedTask.description}`
  }
  if (oldTask.performerId !== updatedTask.performerId) {
    if (!updatedPerformer) {
      text += '\n💪 Нет исполнителя'
    } else {
      text += `\n💪 ${updatedPerformer?.name} ${updatedPerformer?.surname}`
    }
  }
  if (oldTask.date !== updatedTask.date) {
    text += `\n📅 ${updatedTask.date}`
  }

  return text
}
