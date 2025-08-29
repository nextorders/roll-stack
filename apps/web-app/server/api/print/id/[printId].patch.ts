import { updatePrintSchema } from '#shared/services/print'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'print:edit')

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

    const print = await repository.print.update(printId, data)

    return {
      ok: true,
      result: print,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
