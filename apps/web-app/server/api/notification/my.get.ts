import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return repository.notification.listByUser(event.context.user.id)
})
