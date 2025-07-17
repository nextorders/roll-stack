import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { updateMenuCategorySchema } from '~~/shared/services/menu'

export default defineEventHandler(async (event) => {
  try {
    const categoryId = getRouterParam(event, 'categoryId')
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updateMenuCategorySchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const category = await repository.menu.updateCategory(categoryId, data)

    return {
      ok: true,
      result: category,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
