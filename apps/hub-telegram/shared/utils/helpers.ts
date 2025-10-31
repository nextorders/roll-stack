import type { FlowItemWithData } from '#shared/types'

export function pluralizationRu(int: number, array: [string, string, string]): string {
  const n = Math.abs(int)

  let idx: 1 | 2 | 0
  // @see http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
  if (n % 10 === 1 && n % 100 !== 11) {
    idx = 0 // one
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    idx = 1 // few
  } else {
    idx = 2 // many
  }

  return array[idx]
}

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
