import { repository } from '@roll-stack/database'

export default defineEventHandler(async () => {
  return repository.client.listLevels()
})
