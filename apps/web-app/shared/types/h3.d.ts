import type { User } from '@roll-stack/database'

declare module 'h3' {
  interface H3EventContext {
    user: User
  }
}
