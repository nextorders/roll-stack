import { type } from 'arktype'

export const updateClientSchema = type({
  selectedCityId: type('string | null | undefined').describe('error.length.invalid').optional(),
})
export type UpdateClient = typeof updateClientSchema.infer
