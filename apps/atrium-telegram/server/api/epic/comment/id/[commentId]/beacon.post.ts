import { createBeaconSchema } from '#shared/services/notification'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const commentId = getRouterParam(event, 'commentId')
    if (!commentId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = createBeaconSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const { public: publicEnv } = useRuntimeConfig()

    await $fetch(`${publicEnv.coreApiUrl}/epic/comment/id/${commentId}/beacon`, {
      method: 'POST',
      body: data,
    })

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
