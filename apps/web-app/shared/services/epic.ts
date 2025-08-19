import { type } from 'arktype'

export const createEpicCommentSchema = type({
  text: type('1 <= string <= 1500').describe('error.length.invalid'),
})
export type CreateEpicComment = typeof createEpicCommentSchema.infer
