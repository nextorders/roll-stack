import { updateEpicSchema } from '#shared/services/epic'
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

    const body = await readBody(event)
    const data = updateEpicSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const epic = await repository.epic.update(epicId, data)

    return {
      ok: true,
      result: epic,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
