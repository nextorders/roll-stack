import { createBeaconSchema } from '#shared/services/notification'
import { db } from '@roll-stack/database'
import { queue } from '@roll-stack/essence'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createBeaconSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const comment = await db.epic.findComment(data.id)
    if (!comment) {
      throw createError({
        statusCode: 404,
        message: 'Not found',
      })
    }

    const epic = await db.epic.find(comment.epicId)
    const users = await db.user.list()
    const commentAuthor = users.find((user) => user.id === comment.userId)
    const sender = users.find((user) => user.id === data.senderId)
    if (!sender) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Create beacon
    for (const userId of data.usersId) {
      const user = users.find((user) => user.id === userId)
      if (!user) {
        continue
      }

      const title = `${suffixByGender(['Создал', 'Создала'], sender?.gender)} маяк в эпике «${epic?.title}»`
      const description = `${commentAuthor?.name} ${commentAuthor?.surname} ${suffixByGender(['оставил', 'оставила'], commentAuthor?.gender)} комментарий: ${comment.text}`

      await db.notification.create({
        type: 'user_beacon_on_epic_comment_created',
        userId,
        authorId: sender.id,
        epicId: comment.epicId,
        epicCommentId: comment.id,
        title,
        description,
      })

      // Queue
      await queue.notification.userBeaconOnEpicCommentCreated({
        userId,
        senderName: sender.name,
        senderSurname: sender.surname,
        title,
        description,
        epicId: comment.epicId,
        epicCommentId: comment.id,
      })
    }

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
