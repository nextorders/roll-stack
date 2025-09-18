import type { Cmd, MethodParams } from 'rabbitmq-client'
import { useConnection } from './connection'

export const EXCHANGES = {
  events: {
    exchange: 'events' as const,
    type: 'direct' as const,
    autoDelete: false,
    durable: true,
  },
  fail: {
    exchange: 'fail' as const,
    type: 'direct' as const,
    autoDelete: false,
    durable: true,
  },
  retry: {
    exchange: 'retry' as const,
    type: 'direct' as const,
    autoDelete: false,
    durable: true,
  },
} satisfies Record<string, MethodParams[Cmd.ExchangeDeclare]>

export async function declareExchanges() {
  for (const [name, config] of Object.entries(EXCHANGES)) {
    await useConnection().exchangeDeclare({
      exchange: name,
      type: config.type,
      autoDelete: config.autoDelete,
      durable: config.durable,
    })
  }
}
