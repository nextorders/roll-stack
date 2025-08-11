import { type } from 'arktype'

export const createActivityScheduleItemSchema = type({
  title: type('5 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
  period: type('string <= 100').describe('error.length.invalid'),
  terms: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
  goal: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
})
export type CreateActivityScheduleItem = typeof createActivityScheduleItemSchema.infer

export const updateActivityScheduleItemSchema = type({
  title: type('5 <= string <= 150 | undefined').describe('error.length.invalid').optional(),
  description: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
  period: type('string <= 100 | undefined').describe('error.length.invalid').optional(),
  terms: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
  goal: type('string <= 1500 | undefined').describe('error.length.invalid').optional(),
})
export type UpdateActivityScheduleItem = typeof updateActivityScheduleItemSchema.infer
