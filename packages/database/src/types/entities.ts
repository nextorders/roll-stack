export type NotificationOption
  = | 'task_completed_atrium'
    | 'task_completed_telegram'

export type UserType = 'staff'
  | 'head'
  | 'partner'
  | 'partner_head'
  | 'partner_admin'
  | 'partner_cook'
  | 'partner_courier'
  | 'guest'
  | 'bot'
export type UserGender = 'male' | 'female' | 'unknown'

export type AgreementPatentStatus = 'not_paid' | 'in_work' | 'on_registration' | 'registered'

export type WeightUnit = 'G' | 'KG' | 'ML' | 'L' | 'OZ' | 'LB'

export type TimeZone = '+00:00'
  | '+01:00'
  | '+02:00'
  | '+03:00'
  | '+04:00'
  | '+05:00'
  | '+06:00'
  | '+07:00'
  | '+08:00'
  | '+09:00'
  | '+10:00'
  | '+11:00'
  | '+12:00'

export type FlowItemType = 'daily_task_report'
  | 'weekly_task_report'
  | 'user_post'
  | 'partner_maintenance'

export type PermissionCode = 'product:view'
  | 'product:edit'
  | 'product:delete'
  | 'product:image:edit'
  | 'post:view'
  | 'post:edit'
  | 'post:delete'
  | 'post:image:edit'
  | 'print:edit'
  | 'print:file:edit'
  | 'print:delete'

export type MediaFormat = 'jpg' | 'webp'
export type FileFormat = 'docx' | 'cdr' | 'zip' | 'pdf'

export type NotificationType = 'task_completed'
  | 'epic_created'
  | 'user_beacon_on_epic_comment_created'

export type ResolutionType = 'success' | 'failure' | 'unknown'

export type CheckoutStatus = 'forming'
  | 'canceled'
  | 'created'
  | 'confirmed'
  | 'cooking'
  | 'prepared'
  | 'on_delivery'
  | 'at_client'
export type CheckoutDeliveryMethod = 'delivery' | 'pickup'

export type PostType = 'telegram' | 'vk'
export type PostStatus = 'draft' | 'scheduled' | 'published'

export type ChannelType = 'website'

export type PaymentMethodType = 'card' | 'cash' | 'online'

export type FeedbackPointType = 'yandex_map' | '2gis_map' | 'vk_group'

export type TelegramUserType = 'private' | 'group' | 'supergroup' | 'channel'

export type TicketStatus = 'opened' | 'closed'

export type TicketFileType = 'image' | 'document' | 'video'

export type CommunicationChannel = 'telegram'
  | 'vk'
  | 'website'
  | 'mobile_app'
  | 'uds'
  | 'store_administrator'
  | 'table_tent'
  | 'contextual_advertising'
  | 'calendar'

export type ActivityScheduleTag = 'permanent'
  | 'temporary'
  | 'optional'
  | 'advertising'
