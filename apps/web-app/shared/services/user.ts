import { type } from 'arktype'
import { userGenderSchema } from './common'

export const completeUserSchema = type({
  name: type('2 <= string <= 50').describe('error.length.invalid'),
  surname: type('2 <= string <= 50').describe('error.length.invalid'),
  email: type('2 <= string <= 80').describe('error.length.invalid'),
  phone: type('11 <= string <= 12').describe('error.length.invalid'),
  caption: type('string <= 100 | undefined').describe('error.length.invalid').optional(),
})
export type CompleteUser = typeof completeUserSchema.infer

export const updateUserSchema = type({
  name: type('2 <= string <= 50 | undefined').describe('error.length.invalid').optional(),
  surname: type('2 <= string <= 50 | undefined').describe('error.length.invalid').optional(),
  email: type('2 <= string <= 80 | undefined').describe('error.length.invalid').optional(),
  phone: type('11 <= string <= 12 | undefined').describe('error.length.invalid').optional(),
  caption: type('string <= 100 | undefined').describe('error.length.invalid').optional(),
  gender: userGenderSchema.describe('error.length.invalid').optional(),
  notifications: type('string').array().describe('error.length.invalid').optional(),
})
export type UpdateUser = typeof updateUserSchema.infer

export const updateUserNotificationsSchema = type({
  active: type('string').array().describe('error.length.invalid').optional(),
})
export type UpdateUserNotifications = typeof updateUserNotificationsSchema.infer
