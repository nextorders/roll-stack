import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return db.locker.listDuplicatesForUser(event.context.user.id)
})
