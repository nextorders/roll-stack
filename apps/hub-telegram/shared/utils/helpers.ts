import type { FlowItemWithData } from '#shared/types'

export function getIconNameForFlowItem(type: FlowItemWithData['type']): string {
  switch (type) {
    case 'user_post':
      return 'i-lucide-square-user-round'
    case 'partner_maintenance':
      return 'i-lucide-user'
    case 'hub_post':
      return 'i-lucide-message-circle'
    case 'hub_iframe':
      return 'i-lucide-video'
    case 'daily_task_report':
    case 'weekly_task_report':
      return 'i-lucide-clipboard-check'
    default:
      return 'i-lucide-clipboard'
  }
}
