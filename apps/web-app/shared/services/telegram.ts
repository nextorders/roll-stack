import { type } from 'arktype'

export const attachTelegramSchema = type({
  accessKey: type('6 <= string <= 18').describe('error.length.invalid'),
  botId: type('string').describe('error.length.invalid'),
})
export type AttachTelegram = typeof attachTelegramSchema.infer
