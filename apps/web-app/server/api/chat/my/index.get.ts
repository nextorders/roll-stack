import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return repository.chat.listByUser(event.context.user.id)
})
