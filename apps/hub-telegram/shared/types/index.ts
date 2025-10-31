import type { FlowItem, FlowItemComment, FlowItemView, User } from '@roll-stack/database'

export type NavigationRoute = {
  path: string
  names: string[]
  title: string
  icon: string
  exact?: boolean
  badge?: string
}

type FlowItemCommentWithUser = FlowItemComment & {
  user: User
}

export type FlowItemWithData = FlowItem & {
  comments: FlowItemCommentWithUser[]
  views: FlowItemView[]
}
