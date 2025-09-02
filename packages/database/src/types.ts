import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type * as tables from './tables'

export type { Database } from './connection'

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

export type AgreementPatentStatus = 'in_work' | 'not_paid' | 'on_registration' | 'registered'

export type WeightUnit = 'G' | 'KG' | 'ML' | 'L' | 'OZ' | 'LB'

export type Permission = InferSelectModel<typeof tables.permissions>
export type PermissionDraft = InferInsertModel<typeof tables.permissions>

export type User = InferSelectModel<typeof tables.users>
export type UserDraft = InferInsertModel<typeof tables.users>

export type Partner = InferSelectModel<typeof tables.partners>
export type PartnerDraft = InferInsertModel<typeof tables.partners>

export type PartnerLegalEntity = InferSelectModel<typeof tables.partnerLegalEntities>
export type PartnerLegalEntityDraft = InferInsertModel<typeof tables.partnerLegalEntities>

export type PartnerAgreement = InferSelectModel<typeof tables.partnerAgreements>
export type PartnerAgreementDraft = InferInsertModel<typeof tables.partnerAgreements>

export type PartnerAgreementFile = InferSelectModel<typeof tables.partnerAgreementFiles>
export type PartnerAgreementFileDraft = InferInsertModel<typeof tables.partnerAgreementFiles>

export type Chat = InferSelectModel<typeof tables.chats>
export type ChatDraft = InferInsertModel<typeof tables.chats>

export type ChatMessage = InferSelectModel<typeof tables.chatMessages>
export type ChatMessageDraft = InferInsertModel<typeof tables.chatMessages>

export type ChatMember = InferSelectModel<typeof tables.chatMembers>
export type ChatMemberDraft = InferInsertModel<typeof tables.chatMembers>

export type Menu = InferSelectModel<typeof tables.menus>
export type MenuDraft = InferInsertModel<typeof tables.menus>

export type MenuCategory = InferSelectModel<typeof tables.menuCategories>
export type MenuCategoryDraft = InferInsertModel<typeof tables.menuCategories>

export type Product = InferSelectModel<typeof tables.products>
export type ProductDraft = InferInsertModel<typeof tables.products>

export type ProductVariant = InferSelectModel<typeof tables.productVariants>
export type ProductVariantDraft = InferInsertModel<typeof tables.productVariants>

export type ProductsInMenuCategory = InferSelectModel<typeof tables.productsInMenuCategories>
export type ProductsInMenuCategoryDraft = InferInsertModel<typeof tables.productsInMenuCategories>

export type ProductVariantsOnMenuCategory = InferSelectModel<typeof tables.productVariantsOnMenuCategories>
export type ProductVariantsOnMenuCategoryDraft = InferInsertModel<typeof tables.productVariantsOnMenuCategories>

export type ProductTag = InferSelectModel<typeof tables.productTags>
export type ProductTagDraft = InferInsertModel<typeof tables.productTags>

export type ProductTagOnProduct = InferSelectModel<typeof tables.productTagsOnProducts>
export type ProductTagOnProductDraft = InferInsertModel<typeof tables.productTagsOnProducts>

export type ProductVariantTag = InferSelectModel<typeof tables.productVariantTags>
export type ProductVariantTagDraft = InferInsertModel<typeof tables.productVariantTags>

export type ProductVariantTagOnProductVariant = InferSelectModel<typeof tables.productVariantTagsOnProductVariants>
export type ProductVariantTagOnProductVariantDraft = InferInsertModel<typeof tables.productVariantTagsOnProductVariants>

export type Media = InferSelectModel<typeof tables.media>
export type MediaDraft = InferInsertModel<typeof tables.media>

export type MediaItem = InferSelectModel<typeof tables.mediaItems>
export type MediaItemDraft = InferInsertModel<typeof tables.mediaItems>

export type Task = InferSelectModel<typeof tables.tasks>
export type TaskDraft = InferInsertModel<typeof tables.tasks>

export type TaskList = InferSelectModel<typeof tables.taskLists>
export type TaskListDraft = InferInsertModel<typeof tables.taskLists>

export type TaskAutoCreator = InferSelectModel<typeof tables.taskAutoCreators>
export type TaskAutoCreatorDraft = InferInsertModel<typeof tables.taskAutoCreators>

export type Notification = InferSelectModel<typeof tables.notifications>
export type NotificationDraft = InferInsertModel<typeof tables.notifications>

export type Checkout = InferSelectModel<typeof tables.checkouts>
export type CheckoutDraft = InferInsertModel<typeof tables.checkouts>

export type CheckoutItem = InferSelectModel<typeof tables.checkoutItems>
export type CheckoutItemDraft = InferInsertModel<typeof tables.checkoutItems>

export type Kitchen = InferSelectModel<typeof tables.kitchens>
export type KitchenDraft = InferInsertModel<typeof tables.kitchens>

export type KitchenRevenue = InferSelectModel<typeof tables.kitchenRevenues>
export type KitchenRevenueDraft = InferInsertModel<typeof tables.kitchenRevenues>

export type Channel = InferSelectModel<typeof tables.channels>
export type ChannelDraft = InferInsertModel<typeof tables.channels>

export type PaymentMethod = InferSelectModel<typeof tables.paymentMethods>
export type PaymentMethodDraft = InferInsertModel<typeof tables.paymentMethods>

export type City = InferSelectModel<typeof tables.cities>
export type CityDraft = InferInsertModel<typeof tables.cities>

export type Post = InferSelectModel<typeof tables.posts>
export type PostDraft = InferInsertModel<typeof tables.posts>

export type PostLike = InferSelectModel<typeof tables.postLikes>
export type PostLikeDraft = InferInsertModel<typeof tables.postLikes>

export type PostComment = InferSelectModel<typeof tables.postComments>
export type PostCommentDraft = InferInsertModel<typeof tables.postComments>

export type File = InferSelectModel<typeof tables.files>
export type FileDraft = InferInsertModel<typeof tables.files>

export type Print = InferSelectModel<typeof tables.prints>
export type PrintDraft = InferInsertModel<typeof tables.prints>

export type PrintOrder = InferSelectModel<typeof tables.printOrders>
export type PrintOrderDraft = InferInsertModel<typeof tables.printOrders>

export type PrintOrderItem = InferSelectModel<typeof tables.printOrderItems>
export type PrintOrderItemDraft = InferInsertModel<typeof tables.printOrderItems>

export type FeedbackPoint = InferSelectModel<typeof tables.feedbackPoints>
export type FeedbackPointDraft = InferInsertModel<typeof tables.feedbackPoints>

export type Client = InferSelectModel<typeof tables.clients>
export type ClientDraft = InferInsertModel<typeof tables.clients>

export type ClientReview = InferSelectModel<typeof tables.clientReviews>
export type ClientReviewDraft = InferInsertModel<typeof tables.clientReviews>

export type NetworkMetrics = InferSelectModel<typeof tables.networkMetrics>
export type NetworkMetricsDraft = InferInsertModel<typeof tables.networkMetrics>

export type TelegramBot = InferSelectModel<typeof tables.telegramBots>
export type TelegramBotDraft = InferInsertModel<typeof tables.telegramBots>

export type TelegramUser = InferSelectModel<typeof tables.telegramUsers>
export type TelegramUserDraft = InferInsertModel<typeof tables.telegramUsers>

export type Ticket = InferSelectModel<typeof tables.tickets>
export type TicketDraft = InferInsertModel<typeof tables.tickets>

export type TicketMessage = InferSelectModel<typeof tables.ticketMessages>
export type TicketMessageDraft = InferInsertModel<typeof tables.ticketMessages>

export type ActivitySchedule = InferSelectModel<typeof tables.activitySchedules>
export type ActivityScheduleDraft = InferInsertModel<typeof tables.activitySchedules>

export type ActivityScheduleItem = InferSelectModel<typeof tables.activityScheduleItems>
export type ActivityScheduleItemDraft = InferInsertModel<typeof tables.activityScheduleItems>

export type Epic = InferSelectModel<typeof tables.epics>
export type EpicDraft = InferInsertModel<typeof tables.epics>

export type EpicComment = InferSelectModel<typeof tables.epicComments>
export type EpicCommentDraft = InferInsertModel<typeof tables.epicComments>

export type LockerItem = InferSelectModel<typeof tables.lockerItems>
export type LockerItemDraft = InferInsertModel<typeof tables.lockerItems>

export type LockerItemDuplicate = InferSelectModel<typeof tables.lockerItemDuplicates>
export type LockerItemDuplicateDraft = InferInsertModel<typeof tables.lockerItemDuplicates>
