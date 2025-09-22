import { createProductVariantSchema } from '#shared/services/product'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'product:edit')

    const body = await readBody(event)
    const data = createProductVariantSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const variant = await repository.product.createVariant(data)

    return {
      ok: true,
      result: variant,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
