import { type } from 'arktype'

export const createBeaconSchema = type({
  usersId: type('string[]').describe('error.length.invalid'),
})
export type CreateBeacon = typeof createBeaconSchema.infer
