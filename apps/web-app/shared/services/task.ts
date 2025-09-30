import { type } from 'arktype'

export const resolutionSchema = type('"success" | "failure" | "unknown"')
export type Resolution = typeof resolutionSchema.infer

export const createTaskSchema = type({
  name: type('2 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 2000 | undefined').describe('error.length.invalid').optional(),
  performerId: type('string | undefined | null').describe('error.length.invalid').optional(),
  date: type('string | undefined | null').describe('error.length.invalid').optional(),
  listId: type('string').describe('error.length.invalid'),
})
export type CreateTask = typeof createTaskSchema.infer

export const updateTaskSchema = type({
  name: type('2 <= string <= 150').describe('error.length.invalid').optional(),
  description: type('string <= 2000 | undefined').describe('error.length.invalid').optional(),
  performerId: type('string | undefined | null').describe('error.length.invalid').optional(),
  date: type('string | undefined | null').describe('error.length.invalid').optional(),
  listId: type('string | undefined').describe('error.length.invalid').optional(),
})
export type UpdateTask = typeof updateTaskSchema.infer

export const completeTaskSchema = type({
  resolution: resolutionSchema.describe('error.length.invalid'),
  report: type('string | undefined').describe('error.length.invalid').optional(),
})
export type CompleteTask = typeof completeTaskSchema.infer

export const createTaskListSchema = type({
  name: type('2 <= string <= 150').describe('error.length.invalid'),
  description: type('string <= 100 | undefined').describe('error.length.invalid').optional(),
  usersId: type('string[]').describe('error.length.invalid'),
})
export type CreateTaskList = typeof createTaskListSchema.infer

export const updateTaskListSchema = type({
  name: type('2 <= string <= 150').describe('error.length.invalid').optional(),
  description: type('string <= 100 | undefined').describe('error.length.invalid').optional(),
  usersId: type('string[]').describe('error.length.invalid'),
})
export type UpdateTaskList = typeof updateTaskListSchema.infer
