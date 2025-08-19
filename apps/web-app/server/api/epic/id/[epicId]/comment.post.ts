import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { createEpicCommentSchema } from '~~/shared/services/epic'

export default defineEventHandler(async (event) => {
  try {
    const epicId = getRouterParam(event, 'epicId')
    if (!epicId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const session = await getUserSession(event)
    if (!session?.user) {
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
      userId: session.user.id,
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
