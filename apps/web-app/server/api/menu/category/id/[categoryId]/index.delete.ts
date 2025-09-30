import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const categoryId = getRouterParam(event, 'categoryId')
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    await db.menu.deleteCategory(categoryId)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
