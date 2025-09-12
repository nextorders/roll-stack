import type { FeedbackPoint, FlowItem, FlowItemComment, Kitchen, PartnerAgreement } from '@roll-stack/database'

export type KitchenWithData = Kitchen & {
  openTime: number
  closeTime: number
  isOpenedNow: boolean
  feedbackPoints: FeedbackPoint[]
  agreement: PartnerAgreement | null
}

export type FlowItemWithData = FlowItem & {
  comments: FlowItemComment[]
}

export type NavigationRoute = {
  path: string
  names: string[]
  title: string
  icon: string
  exact?: boolean
  badge?: string
}
