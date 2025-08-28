import { type } from 'arktype'

export const createEpicSchema = type({
  title: type('2 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
})
export type CreateEpic = typeof createEpicSchema.infer

export const updateEpicSchema = type({
  title: type('2 <= string <= 150 | undefined').describe('error.length.invalid').optional(),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
})
export type UpdateEpic = typeof updateEpicSchema.infer

export const createEpicCommentSchema = type({
  text: type('1 <= string <= 1500').describe('error.length.invalid'),
})
export type CreateEpicComment = typeof createEpicCommentSchema.infer
