import { type } from 'arktype'

export const updateClientSchema = type({
  selectedCityId: type('string | null | undefined').describe('error.length.invalid').optional(),
})
export type UpdateClient = typeof updateClientSchema.infer

export const completeBonusProgramRegistrationSchema = type({
  name: type('2 <= string <= 50').describe('error.length.invalid'),
  surname: type('2 <= string <= 50 | undefined').describe('error.length.invalid').optional(),
  email: type('2 <= string <= 80').describe('error.length.invalid'),
  birthDate: type('string').describe('error.length.invalid'),
})
export type CompleteBonusProgramRegistration = typeof completeBonusProgramRegistrationSchema.infer
