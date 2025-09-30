import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: not this user
    const likeInDB = await db.post.findLike(postId, event.context.user.id)
    if (!likeInDB) {
      throw createError({
        statusCode: 400,
        message: 'Not your like',
      })
    }

    await db.post.deleteLike(likeInDB.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
