import type { User } from '@roll-stack/database'
import { describe, expect, it } from 'vitest'
import { hasPermission } from '../../permission'

const mockUser: Partial<User> = {
  id: 'test',
  permissions: ['post:view'],
}

describe('hasPermission', () => {
  it('should return correct result', () => {
    try {
      const res = hasPermission(mockUser as User, 'post:view')
      expect(res).toBeTruthy()
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })

  it('should thrown error', () => {
    try {
      hasPermission(mockUser as User, 'post:delete')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})
