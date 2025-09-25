import type { Cmd, MethodParams } from 'rabbitmq-client'

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
