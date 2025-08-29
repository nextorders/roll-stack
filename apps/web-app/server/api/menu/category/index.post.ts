import { createMenuCategorySchema } from '#shared/services/menu'
import { createId } from '@paralleldrive/cuid2'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createMenuCategorySchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const id = createId()

    const category = await repository.menu.createCategory({
      id,
      slug: id,
      name: data.name,
      menuId: data.menuId,
      icon: null,
    })

    return {
      ok: true,
      result: category,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
