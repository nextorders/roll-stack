import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return db.chat.listByUser(event.context.user.id)
})
