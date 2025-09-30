import { db } from '@roll-stack/database'

const channelId = 'wl0g90in5guj03zr7xo701tz'

export default defineEventHandler(async () => {
  try {
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
