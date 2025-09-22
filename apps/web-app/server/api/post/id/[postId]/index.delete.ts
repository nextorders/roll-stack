import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'post:delete')

    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    await repository.post.delete(postId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
