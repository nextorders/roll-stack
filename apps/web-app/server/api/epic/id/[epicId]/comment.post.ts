import { createEpicCommentSchema } from '#shared/services/epic'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const epicId = getRouterParam(event, 'epicId')
    if (!epicId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = createEpicCommentSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const comment = await db.epic.createComment({
      ...data,
      userId: event.context.user.id,
      epicId,
    })

    return {
      ok: true,
      result: comment,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
