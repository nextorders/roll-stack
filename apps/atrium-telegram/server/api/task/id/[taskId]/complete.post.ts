import type { Task, User } from '@roll-stack/database'
import { completeTaskSchema } from '#shared/services/task'
import { getLocalizedResolution } from '#shared/utils/helpers'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

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
    const data = completeTaskSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    // Guards:
    // If task not exist
    // If performer is not user
    const task = await repository.task.find(taskId)
    if (!task) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }
    if (!!task.performerId && task.performerId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'You are not the performer of this task',
      })
    }

    const updatedTask = await repository.task.complete(taskId, {
      resolution: data.resolution,
      report: data.report,
    })
    if (!updatedTask) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }

    // Clear focus if needed
    if (user.focusedTaskId === taskId) {
      await repository.user.update(user.id, {
        focusedTaskId: null,
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
        const text = prepareBotMessage(user, updatedTask)

        // Send message as bot
        await repository.chat.createMessage({
          chatId: list.chat.id,
          userId: bot.user.id,
          text,
        })
      }
    }

    // Notify all staff
    if (user.type === 'staff') {
      const users = await repository.user.list()
      const allStaffExceptUser = users.filter((u) => u.type === 'staff' && u.id !== user.id)

      for (const staff of allStaffExceptUser) {
        if (staff.notifications.includes('task_completed_atrium')) {
          await repository.notification.create({
            authorId: user.id,
            userId: staff.id,
            taskId: updatedTask.id,
            type: 'task_completed',
            title: `${suffixByGender(['Завершил', 'Завершила'], user.gender)} задачу «${updatedTask.name}»`,
            description: updatedTask.report ? updatedTask.report : 'Без отчета',
          })
        }
      }
    }

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})

function prepareBotMessage(author: User, task: Task) {
  let text = `${author.name} ${author.surname} ${suffixByGender(['закрыл', 'закрыла'], author.gender)} задачу «${task.name}»`

  if (task.resolution) {
    text += `\n🙏 ${getLocalizedResolution(task.resolution)}`
  }
  if (task.report) {
    text += `\n💬 ${task.report}`
  }

  return text
}
