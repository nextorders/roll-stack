import { createBeaconSchema } from '#shared/services/notification'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { useAtriumBot } from '~~/server/services/telegram/atrium-bot'

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

    const { telegram } = useRuntimeConfig()

    const comment = await repository.epic.findComment(commentId)
    if (!comment) {
      throw createError({
        statusCode: 404,
        message: 'Not found',
      })
    }

    const epic = await repository.epic.find(comment.epicId)
    const users = await repository.user.list()
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

      await repository.notification.create({
        type: 'user_beacon_on_epic_comment_created',
        userId,
        authorId: sender.id,
        epicId: comment.epicId,
        epicCommentId: comment.id,
        title,
        description,
      })

      // Telegram - Atrium
      const atriumUser = user.telegramUsers.find((u) => u.botId === telegram.atriumBotId)
      const bot = await repository.telegram.findBot(telegram.atriumBotId)

      if (bot && atriumUser) {
        const separator = 'zzzzz'
        const startAppData = `epic${separator}${epic?.id}`

        await useAtriumBot()
          .api
          .sendMessage(
            atriumUser.telegramId,
            `👋 ${sender.name} ${sender.surname}\n${title}\n\n${description}`,
            {
              reply_markup: {
                inline_keyboard: [[{
                  text: 'Открыть эпик',
                  url: `https://t.me/${bot.username}/app?startapp=${startAppData}`,
                }]],
              },
            },
          )
      }
    }

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
