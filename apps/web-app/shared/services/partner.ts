import { type } from 'arktype'

export const updatePartnerSchema = type({
  priceLevel: type('1 <= number <= 4 | undefined').describe('error.length.invalid').optional(),
  city: type('string <= 50 | undefined').describe('error.length.invalid').optional(),
  legalEntityId: type('string | undefined').describe('error.length.invalid').optional(),
})
export type UpdatePartner = typeof updatePartnerSchema.infer

export const createPartnerLegalEntitySchema = type({
  inn: type('10 <= string <= 12').describe('error.length.invalid'),
  ogrnip: type('15 <= string <= 15 | undefined').describe('error.length.invalid').optional(),
  name: type('8 <= string <= 150').describe('error.length.invalid'),
  comment: type('0 <= string <= 500 | undefined').describe('error.length.invalid').optional(),
})
export type CreatePartnerLegalEntity = typeof createPartnerLegalEntitySchema.infer

export const updatePartnerLegalEntitySchema = type({
  inn: type('10 <= string <= 12 | undefined').describe('error.length.invalid').optional(),
  ogrnip: type('15 <= string <= 15 | undefined').describe('error.length.invalid').optional(),
  name: type('8 <= string <= 150 | undefined').describe('error.length.invalid').optional(),
  comment: type('0 <= string <= 500 | undefined').describe('error.length.invalid').optional(),
})
export type UpdatePartnerLegalEntity = typeof updatePartnerLegalEntitySchema.infer

export const createPartnerAgreementSchema = type({
  concludedAt: type('string').describe('error.length.invalid'),
  willEndAt: type('string').describe('error.length.invalid').optional(),
  internalId: type('string').describe('error.length.invalid'),
  royalty: type('number >= 0').describe('error.length.invalid'),
  minRoyaltyPerMonth: type('number >= 0').describe('error.length.invalid'),
  lumpSumPayment: type('number >= 0').describe('error.length.invalid'),
  legalEntityId: type('string').describe('error.length.invalid'),
  comment: type('string | undefined').describe('error.length.invalid').optional(),
})
export type CreatePartnerAgreement = typeof createPartnerAgreementSchema.infer

export const updatePartnerAgreementSchema = type({
  concludedAt: type('string | undefined').describe('error.length.invalid').optional(),
  willEndAt: type('string | undefined').describe('error.length.invalid').optional(),
  internalId: type('string | undefined').describe('error.length.invalid').optional(),
  royalty: type('number >= 0 | undefined').describe('error.length.invalid').optional(),
  minRoyaltyPerMonth: type('number >= 0 | undefined').describe('error.length.invalid').optional(),
  marketingFee: type('number >= 0 | undefined').describe('error.length.invalid').optional(),
  minMarketingFeePerMonth: type('number >= 0 | undefined').describe('error.length.invalid').optional(),
  lumpSumPayment: type('number >= 0 | undefined').describe('error.length.invalid').optional(),
  legalEntityId: type('string | undefined').describe('error.length.invalid').optional(),
  comment: type('string | undefined').describe('error.length.invalid').optional(),
})
export type UpdatePartnerAgreement = typeof updatePartnerAgreementSchema.infer
