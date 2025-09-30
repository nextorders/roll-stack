import { updatePrintSchema } from '#shared/services/print'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'print:edit')

    const printId = getRouterParam(event, 'printId')
    if (!printId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePrintSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const print = await db.print.update(printId, data)

    return {
      ok: true,
      result: print,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
