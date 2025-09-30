import { db } from '@roll-stack/database'

export default defineEventHandler(async () => {
  return db.user.list()
})
