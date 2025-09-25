import { type } from 'arktype'

const flowTypeSchema = type('"user_post" | "daily_task_report" | "weekly_task_report"')

export const createFlowItemSchema = type({
  title: type('2 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
  type: flowTypeSchema.describe('error.length.invalid'),
})
export type CreateFlowItem = typeof createFlowItemSchema.infer
