import { createEpicSchema } from '#shared/services/epic'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createEpicSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const epic = await repository.epic.create({
      ...data,
      userId: event.context.user.id,
    })
    if (!epic) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create',
      })
    }

    // Notify all staff
    if (event.context.user.type === 'staff') {
      const users = await repository.user.list()
      const allStaffExceptUser = users.filter((u) => u.type === 'staff' && u.id !== event.context.user.id)

      for (const staff of allStaffExceptUser) {
        await repository.notification.create({
          authorId: event.context.user.id,
          userId: staff.id,
          epicId: epic.id,
          type: 'epic_created',
          title: `${suffixByGender(['Создал', 'Создала'], event.context.user.gender)} эпик «${epic.title}»`,
          description: epic.description ? epic.description : 'Без описания',
        })
      }
    }

    return {
      ok: true,
      result: epic,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
