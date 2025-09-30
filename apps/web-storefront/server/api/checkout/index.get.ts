import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const { secure } = await getUserSession(event)
    if (!secure?.checkoutId) {
      return null
    }

    return db.checkout.find(secure.checkoutId)
  } catch (error) {
    throw errorResolver(error)
  }
})
