import { createEpicCommentSchema } from '#shared/services/epic'
import { repository } from '@roll-stack/database'
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

    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    const body = await readBody(event)
    const data = createEpicCommentSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const comment = await repository.epic.createComment({
      ...data,
      userId: user.id,
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
