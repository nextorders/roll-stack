import { createPrintSchema } from '#shared/services/print'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'print:edit')

    const body = await readBody(event)
    const data = createPrintSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const print = await db.print.create(data)

    return {
      ok: true,
      result: print,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
