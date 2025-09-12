import type { FeedbackPoint, Kitchen, PartnerAgreement } from '@roll-stack/database'

export type KitchenWithData = Kitchen & {
  openTime: number
  closeTime: number
  isOpenedNow: boolean
  feedbackPoints: FeedbackPoint[]
  agreement: PartnerAgreement | null
}
