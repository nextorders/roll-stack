import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { createBeaconSchema } from '~~/shared/services/notification'

export default defineEventHandler(async (event) => {
  try {
    const commentId = getRouterParam(event, 'commentId')
    if (!commentId) {
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
    const data = createBeaconSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const comment = await repository.epic.findComment(commentId)
    if (!comment) {
      throw createError({
        statusCode: 404,
        message: 'Not found',
      })
    }

    const users = await repository.user.list()
    const commentAuthor = users.find((user) => user.id === comment.userId)
    const epic = await repository.epic.find(comment.epicId)

    // Create beacon
    for (const userId of data.usersId) {
      const user = users.find((user) => user.id === userId)
      if (!user) {
        continue
      }

      await repository.notification.create({
        type: 'user_beacon_on_epic_comment_created',
        userId,
        authorId: session.user.id,
        epicId: comment.epicId,
        epicCommentId: comment.id,
        title: `${suffixByGender(['Создал', 'Создала'], user.gender)} маяк в эпике «${epic?.title}»`,
        description: `${commentAuthor?.name} ${commentAuthor?.surname} ${suffixByGender(['оставил', 'оставила'], commentAuthor?.gender)} комментарий: ${comment.text}`,
      })
    }

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
