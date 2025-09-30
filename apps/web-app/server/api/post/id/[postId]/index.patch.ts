import { updatePostSchema } from '#shared/services/post'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'post:edit')

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

    const post = await db.post.update(postId, data)

    return {
      ok: true,
      result: post,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
