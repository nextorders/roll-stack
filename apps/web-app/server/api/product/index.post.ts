import { createProductSchema } from '#shared/services/product'
import { createId } from '@paralleldrive/cuid2'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'product:edit')

    const body = await readBody(event)
    const data = createProductSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const id = createId()

    const product = await repository.product.create({
      id,
      slug: id,
      name: data.name,
      description: data.description ?? '',
    })

    return {
      ok: true,
      result: product,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
