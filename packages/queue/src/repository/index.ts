import { useConnection } from '../connection'
import { Ticket } from './ticket'

class Repository {
  readonly ticket = Ticket

  checkHealth(): boolean {
    return useConnection().ready
  }
}

export const repository = new Repository()
