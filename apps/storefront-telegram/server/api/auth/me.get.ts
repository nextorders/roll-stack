import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return db.client.find(event.context.client.id)
})
