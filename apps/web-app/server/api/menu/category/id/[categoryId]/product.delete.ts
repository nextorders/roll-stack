import { detachProductFromMenuCategorySchema } from '#shared/services/menu'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

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
    const data = detachProductFromMenuCategorySchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const category = await repository.menu.findCategory(categoryId)
    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found',
      })
    }

    // Guard: If product not in category
    if (!category.products.some((product) => product.productId === data.productId)) {
      throw createError({
        statusCode: 400,
        message: 'Product not in category',
      })
    }

    await repository.menu.detachProduct(categoryId, data.productId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
