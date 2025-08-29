import { type } from 'arktype'

export const createBeaconSchema = type({
  id: type('string').describe('error.length.invalid'),
  senderId: type('string').describe('error.length.invalid'),
  usersId: type('string[]').describe('error.length.invalid'),
})
export type CreateBeacon = typeof createBeaconSchema.infer
