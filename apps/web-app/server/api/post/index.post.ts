import { createPostSchema } from '#shared/services/post'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'post:edit')

    const body = await readBody(event)
    const data = createPostSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const post = await db.post.create({
      ...data,
      authorId: event.context.user.id,
    })

    return {
      ok: true,
      result: post,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
