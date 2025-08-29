import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return repository.locker.listDuplicatesForUser(event.context.user.id)
})
