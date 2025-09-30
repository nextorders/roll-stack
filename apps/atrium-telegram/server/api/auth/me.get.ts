import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return db.user.find(event.context.user.id)
})
