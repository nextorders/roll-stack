import { createPostCommentSchema } from '#shared/services/post'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = createPostCommentSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const comment = await repository.post.createComment({
      ...data,
      userId: event.context.user.id,
      postId,
    })

    return {
      ok: true,
      result: comment,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
