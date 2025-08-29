import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return repository.user.find(event.context.user.id)
})
