import { updateTaskListSchema } from '#shared/services/task'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const listId = getRouterParam(event, 'listId')
    if (!listId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const list = await repository.task.findList(listId)
    if (!list) {
      throw createError({
        statusCode: 404,
        message: 'Task list not found',
      })
    }

    // Guard: if don't have access
    const canEdit = list.chat?.members.some((member) => member.userId === event.context.user.id)
    if (!canEdit) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      })
    }

    const body = await readBody(event)
    const data = updateTaskListSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const updatedList = await repository.task.updateList(listId, data)

    // Data in chat
    if (updatedList?.chatId) {
      await repository.chat.update(updatedList.chatId, {
        name: data.name,
        description: data.description,
      })
    }

    // Update members
    if (list.chat && data.usersId.length > 0) {
      // Check if have new Id's
      for (const userId of data.usersId) {
        const member = list.chat?.members.find((member) => member.userId === userId)
        if (!member?.id) {
          await repository.chat.createMember({
            chatId: list.chat.id,
            userId,
          })
        }
      }

      // Check if have removed Id's
      for (const member of list.chat.members) {
        // Bot?
        if (member.userId === 'fsti10ba0cb7uxkal4uoja9r') {
          continue
        }

        if (!data.usersId.includes(member.userId)) {
          await repository.chat.deleteMember(member.id)
        }
      }
    }

    return {
      ok: true,
      result: updatedList,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
