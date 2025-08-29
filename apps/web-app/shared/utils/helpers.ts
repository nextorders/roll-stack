import type { AgreementPatentStatus, User } from '@roll-stack/database'
import type { Resolution } from '../services/task'

export function getResolutionForSelect(): { value: Resolution, label: string, icon: string }[] {
  return [
    { value: 'success', label: 'Успешно выполнена', icon: 'i-lucide-circle-check' },
    { value: 'failure', label: 'Не выполнена', icon: 'i-lucide-circle-x' },
    { value: 'unknown', label: 'Не ясно, есть вопросы', icon: 'i-lucide-circle-help' },
  ]
}

export function getLocalizedResolution(resolution: Resolution) {
  switch (resolution) {
    case 'success':
      return 'Успешно выполнена'
    case 'failure':
      return 'Не выполнена'
    case 'unknown':
      return 'Не ясно, есть вопросы'
  }
}

export function getResolutionIcon(resolution: Resolution) {
  switch (resolution) {
    case 'success':
      return 'i-lucide-circle-check'
    case 'failure':
      return 'i-lucide-circle-x'
    case 'unknown':
      return 'i-lucide-circle-help'
  }
}

export function getPatentStatus(status: AgreementPatentStatus) {
  switch (status) {
    case 'in_work':
      return 'В работе'
    case 'on_registration':
      return 'На регистрации'
    case 'registered':
      return 'Зарегистрирован'
  }
}

export function getPatentStatusForSelect(): { value: AgreementPatentStatus, label: string }[] {
  return [
    { value: 'in_work', label: 'В работе' },
    { value: 'on_registration', label: 'На регистрации' },
    { value: 'registered', label: 'Зарегистрирован' },
  ]
}

export function getUserTypeLabel(type: User['type']): string {
  switch (type) {
    case 'partner':
      return 'Партнер'
    case 'partner_head':
      return 'Директор'
    case 'partner_admin':
      return 'Администратор'
    case 'partner_cook':
      return 'Повар'
    case 'partner_courier':
      return 'Курьер'
    case 'head':
      return 'Руководитель'
    case 'staff':
      return 'Сотрудник сети'
    default:
      return ''
  }
}

export function getAgreementProgressPercentLeft(concludedAt?: string | null, willEndAt?: string | null): number {
  if (!concludedAt || !willEndAt) {
    return 0
  }

  const nowMs = Date.now()
  const concludedAtMs = new Date(concludedAt).getTime()
  const willEndAtMs = new Date(willEndAt).getTime()
  if (Number.isNaN(concludedAtMs) || Number.isNaN(willEndAtMs)) {
    return 0
  }
  if (willEndAtMs <= concludedAtMs) {
    return 0
  }

  const total = willEndAtMs - concludedAtMs
  const remaining = willEndAtMs - nowMs
  const remainingPct = (remaining / total) * 100
  const res = Math.floor(remainingPct)

  return Math.min(100, Math.max(0, res))
}

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

export const formatNumber = new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format
