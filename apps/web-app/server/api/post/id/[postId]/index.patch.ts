import { updatePostSchema } from '#shared/services/post'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'post:edit')

    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePostSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const post = await repository.post.update(postId, data)

    return {
      ok: true,
      result: post,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
