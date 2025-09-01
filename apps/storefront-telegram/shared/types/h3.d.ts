import type { Client } from '@roll-stack/database'

declare module 'h3' {
  interface H3EventContext {
    client: Client
  }
}
