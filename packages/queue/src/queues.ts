import type { Cmd, MethodParams } from 'rabbitmq-client'
import { useConnection } from './connection'
import { EXCHANGES } from './exchanges'

export const QUEUES = {
  'telegram': {
    queue: 'telegram',
    arguments: {
      'x-queue-type': 'classic',
      'x-dead-letter-exchange': EXCHANGES.fail.exchange,
    },
    autoDelete: false,
    durable: true,
  },
  'telegram.retry.dlx': {
    queue: 'telegram.retry.dlx',
    arguments: {
      'x-queue-type': 'classic',
      'x-queue-mode': 'lazy',
      'x-dead-letter-exchange': EXCHANGES.retry.exchange,
      'x-message-ttl': 10000,
    },
    autoDelete: false,
    durable: true,
  },
} satisfies Record<string, MethodParams[Cmd.QueueDeclare]>

export const ROUTING_KEYS = {
  ticket: {
    messageCreated: 'ticket.message.created',
  },
} as const

export const BINDINGS = [
  {
    exchange: EXCHANGES.events.exchange,
    queue: QUEUES.telegram.queue,
    routingKey: ROUTING_KEYS.ticket.messageCreated,
  },
  {
    exchange: EXCHANGES.retry.exchange,
    queue: QUEUES.telegram.queue,
    routingKey: ROUTING_KEYS.ticket.messageCreated,
  },
  {
    exchange: EXCHANGES.fail.exchange,
    queue: QUEUES['telegram.retry.dlx'].queue,
    routingKey: ROUTING_KEYS.ticket.messageCreated,
  },
] satisfies MethodParams[Cmd.QueueBind][]

export async function declareQueuesAndBindings() {
  for (const [queue, config] of Object.entries(QUEUES)) {
    await useConnection().queueDeclare({
      queue,
      arguments: config.arguments,
      autoDelete: config.autoDelete,
      durable: config.durable,
    })
  }

  for (const { exchange, queue, routingKey } of BINDINGS) {
    await useConnection().queueBind({
      exchange,
      queue,
      routingKey,
    })
  }
}
