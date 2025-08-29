import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: already have like on this post
    const likeInDB = await repository.post.findLike(postId, event.context.user.id)
    if (likeInDB) {
      throw createError({
        statusCode: 400,
        message: 'Already liked this post',
      })
    }

    const like = await repository.post.createLike(postId, event.context.user.id)

    return {
      ok: true,
      result: like,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
