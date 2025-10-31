import type { FormError } from '@nuxt/ui'
import type { Type } from 'arktype'
import { type } from 'arktype'

export function createValidator(schema: Type<any>) {
  const { t } = useI18n()

  return function (state: Type<any>) {
    const errors: FormError[] = []

    const result = schema(state)
    if (result instanceof type.errors) {
      result.forEach((error) => {
        errors.push({ name: error.path.toString(), message: t(error.meta?.description ?? 'error.common') })
      })
    }

    return errors
  }
}
