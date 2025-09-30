import { db } from '@roll-stack/database'

export default defineEventHandler(async () => {
  try {
    const { public: { channelId } } = useRuntimeConfig()

    const channel = await db.channel.find(channelId)
    if (!channel) {
      throw createError({
        statusCode: 404,
        message: 'Channel not found',
      })
    }

    return channel
  } catch (error) {
    throw errorResolver(error)
  }
})
