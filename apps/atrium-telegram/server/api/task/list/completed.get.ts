import { repository } from '@roll-stack/database'

export default defineEventHandler(async () => {
  return repository.task.findAll()
})
