import { createPrintSchema } from '#shared/services/print'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'print:edit')

    const body = await readBody(event)
    const data = createPrintSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const print = await repository.print.create(data)

    return {
      ok: true,
      result: print,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
