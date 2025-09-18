import type { ConsumerStatus, Publisher } from 'rabbitmq-client'
import { Connection } from 'rabbitmq-client'
import { declareExchanges } from './exchanges'
import { declareQueuesAndBindings } from './queues'

let instance: Connection | null = null
let publisher: Publisher | null = null

export const CONSUMER_ANSWER = {
  SUCCESS: 0 as ConsumerStatus.ACK,
  IGNORE: 1 as ConsumerStatus.REQUEUE,
  FAIL: 2 as ConsumerStatus.DROP,
}

export async function useCreateConnection(connectionString: string) {
  instance = createConnection(connectionString)

  await declareExchanges()
  await declareQueuesAndBindings()
}

export function useConnection(): Connection {
  if (!instance) {
    throw new Error('Connection is not created')
  }

  return instance
}

export function usePublisher(): Publisher {
  if (!publisher) {
    publisher = useConnection().createPublisher({
      maxAttempts: 2,
      confirm: true,
    })

    return publisher
  }

  return publisher
}

function createConnection(connectionString: string): Connection {
  const rabbit = new Connection({
    url: connectionString,
  })

  rabbit.on('error', (err) => {
    console.error('RabbitMQ connection error', err)
  })
  rabbit.on('connection', () => {
    console.warn('Connection successfully (re)established')
  })

  return rabbit
}
