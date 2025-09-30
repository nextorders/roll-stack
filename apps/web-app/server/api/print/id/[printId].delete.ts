import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'print:delete')

    const printId = getRouterParam(event, 'printId')
    if (!printId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    await db.print.delete(printId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
