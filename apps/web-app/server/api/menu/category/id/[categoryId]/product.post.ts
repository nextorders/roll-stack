import { repository } from '@sushi-atrium/database'
import { type } from 'arktype'
import { attachProductToMenuCategorySchema } from '~~/shared/services/menu'

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
    const data = attachProductToMenuCategorySchema(body)
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

    // Guard: If product is already in category
    if (category.products.some((product) => product.id === data.productId)) {
      throw createError({
        statusCode: 400,
        message: 'Product is already in category',
      })
    }

    await repository.menu.attachProduct(categoryId, data.productId, data.productVariantsId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
