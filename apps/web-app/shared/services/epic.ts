import { type } from 'arktype'

export const createEpicSchema = type({
  title: type('2 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
})
export type CreateEpic = typeof createEpicSchema.infer

export const createEpicCommentSchema = type({
  text: type('1 <= string <= 1500').describe('error.length.invalid'),
})
export type CreateEpicComment = typeof createEpicCommentSchema.infer
