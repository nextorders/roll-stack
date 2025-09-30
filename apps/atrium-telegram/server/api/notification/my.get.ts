import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return db.notification.listByUser(event.context.user.id)
})
