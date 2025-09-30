import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body?.phone) {
      throw createError({ statusCode: 400, message: 'Missing phone' })
    }

    const preparedPhone = body.phone.replace(/\D/g, '')
    if (preparedPhone.length !== 11) {
      throw createError({ statusCode: 400, message: 'Invalid phone' })
    }

    const userInDB = await db.user.findByPhone(preparedPhone)
    if (!userInDB) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    await setUserSession(event, {
      user: {
        id: userInDB.id,
        name: userInDB.name,
        surname: userInDB.surname,
        avatarUrl: userInDB.avatarUrl,
      },
    })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
