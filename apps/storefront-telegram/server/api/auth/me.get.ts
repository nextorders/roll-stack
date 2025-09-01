import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  return repository.client.find(event.context.client.id)
})
