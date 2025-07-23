import { cuid2 } from 'drizzle-cuid2/postgres'
import { relations } from 'drizzle-orm'
import { boolean, date, integer, jsonb, numeric, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

type UserType = 'staff' | 'head' | 'partner' | 'guest' | 'bot'
type UserGender = 'male' | 'female' | 'unknown'

type PermissionCode = 'product:view'
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

type WeightUnit = 'G' | 'KG' | 'ML' | 'L' | 'OZ' | 'LB'

type MediaFormat = 'jpg' | 'webp'
type FileFormat = 'docx' | 'cdr' | 'zip' | 'pdf'

type NotificationType = 'task_completed'

type ResolutionType = 'success' | 'failure' | 'unknown'

type CheckoutStatus = 'forming'
  | 'canceled'
  | 'created'
  | 'confirmed'
  | 'cooking'
  | 'prepared'
  | 'on_delivery'
  | 'at_client'
type CheckoutDeliveryMethod = 'delivery' | 'pickup'

type PostType = 'telegram' | 'vk'
type PostStatus = 'draft' | 'scheduled' | 'published'

type ChannelType = 'website'

type PaymentMethodType = 'card' | 'cash' | 'online'

type FeedbackPointType = 'yandex_map' | '2gis_map' | 'vk_group'

export const permissions = pgTable('permissions', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  code: varchar('code').notNull(),
  description: varchar('description'),
})

export const users = pgTable('users', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  onlineAt: timestamp('online_at', { precision: 3, withTimezone: true, mode: 'string' }),
  type: varchar('type').notNull().$type<UserType>(),
  isActive: boolean('is_active').notNull().default(true),
  gender: varchar('gender').notNull().default('unknown').$type<UserGender>(),
  name: varchar('name').notNull(),
  surname: varchar('surname').notNull().default(''),
  caption: varchar('caption').notNull().default(''),
  email: varchar('email').unique(),
  phone: varchar('phone').unique(),
  avatarUrl: varchar('avatar_url'),
  focusedTaskId: cuid2('focused_task_id'),
  permissions: jsonb('permissions').notNull().default([]).$type<PermissionCode[]>(),
})

export const partners = pgTable('partners', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  priceLevel: integer('price_level').notNull().default(0),
  prestige: integer('prestige').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  gender: varchar('gender').notNull().default('unknown').$type<UserGender>(),
  name: varchar('name').notNull(),
  surname: varchar('surname').notNull().default(''),
  avatarUrl: varchar('avatar_url'),
  city: varchar('city'),
  legal: varchar('legal'),
  legalEntityId: cuid2('legal_entity_id').references(() => partnerLegalEntities.id),
  activeAgreementId: cuid2('active_agreement_id').references(() => partnerAgreements.id),
})

export const partnerLegalEntities = pgTable('partner_legal_entities', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  inn: varchar('inn').notNull(),
  ogrnip: varchar('ogrnip'),
  comment: varchar('comment'),
})

export const partnerAgreements = pgTable('partner_agreements', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  concludedAt: timestamp('concluded_at', { precision: 3, withTimezone: true, mode: 'string' }),
  willEndAt: timestamp('will_end_at', { precision: 3, withTimezone: true, mode: 'string' }),
  internalId: varchar('internal_id').notNull(),
  royalty: numeric('royalty', { mode: 'number' }).notNull().default(0),
  minRoyaltyPerMonth: numeric('min_royalty_per_month', { mode: 'number' }).notNull().default(0),
  marketingFee: numeric('marketing_fee', { mode: 'number' }).notNull().default(0),
  minMarketingFeePerMonth: numeric('min_marketing_fee_per_month', { mode: 'number' }).notNull().default(0),
  lumpSumPayment: numeric('lump_sum_payment', { mode: 'number' }).notNull().default(0),
  comment: varchar('comment'),
  legalEntityId: cuid2('legal_entity_id').references(() => partnerLegalEntities.id),
})

export const chats = pgTable('chats', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  isArchived: boolean('is_archived').notNull().default(false),
  lastMessageId: cuid2('last_message_id'),
  taskListId: cuid2('task_list_id').references(() => taskLists.id),
})

export const chatMessages = pgTable('chat_messages', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  text: varchar('text'),
  chatId: cuid2('chat_id').notNull().references(() => chats.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: cuid2('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const chatMembers = pgTable('chat_members', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  chatId: cuid2('chat_id').notNull().references(() => chats.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: cuid2('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const menus = pgTable('menus', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  slug: varchar('slug').notNull(),
  name: varchar('name').notNull(),
  isActive: boolean('is_active').notNull().default(false),
})

export const menuCategories = pgTable('menu_categories', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  slug: varchar('slug').notNull(),
  name: varchar('name').notNull(),
  icon: varchar('icon'),
  priority: integer('priority').notNull().default(0),
  menuId: cuid2('menu_id').notNull().references(() => menus.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const products = pgTable('products', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  slug: varchar('slug').notNull(),
  isAvailableForPurchase: boolean('is_available_for_purchase').notNull().default(true),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  mediaId: cuid2('media_id').references(() => media.id),
})

export const productVariants = pgTable('product_variants', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  weightValue: numeric('weight_value', { mode: 'number' }).notNull(),
  weightUnit: varchar('weight_unit').notNull().$type<WeightUnit>(),
  gross: numeric('gross', { mode: 'number' }).notNull(),
  net: numeric('net', { mode: 'number' }),
  calories: numeric('calories', { mode: 'number' }),
  protein: numeric('protein', { mode: 'number' }),
  fat: numeric('fat', { mode: 'number' }),
  carbohydrate: numeric('carbohydrate', { mode: 'number' }),
  sku: varchar('sku'),
  productId: cuid2('product_id').notNull().references(() => products.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const productsInMenuCategories = pgTable('products_in_menu_categories', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  menuCategoryId: cuid2('menu_category_id').notNull().references(() => menuCategories.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  productId: cuid2('product_id').notNull().references(() => products.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const productVariantsOnMenuCategories = pgTable('product_variants_on_menu_categories', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  productInMenuCategoryId: cuid2('product_in_menu_category_id').notNull().references(() => productsInMenuCategories.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  productVariantId: cuid2('product_variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const productTags = pgTable('product_tags', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
})

export const productTagsOnProducts = pgTable('product_tags_on_products', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  productId: cuid2('product_id').notNull().references(() => products.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  productTagId: cuid2('product_tag_id').notNull().references(() => productTags.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const productVariantTags = pgTable('product_variant_tags', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
})

export const productVariantTagsOnProductVariants = pgTable('product_variant_tags_on_product_variants', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  productVariantId: cuid2('product_variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  productVariantTagId: cuid2('product_variant_tag_id').notNull().references(() => productVariantTags.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const media = pgTable('media', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const mediaItems = pgTable('media_items', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  url: varchar('url').notNull(),
  size: integer('size').notNull(),
  format: varchar('format').notNull().$type<MediaFormat>(),
  mediaId: cuid2('media_id').notNull().references(() => media.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const tasks = pgTable('tasks', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { precision: 3, withTimezone: true, mode: 'string' }),
  name: varchar('name').notNull(),
  description: varchar('description'),
  date: date('date', { mode: 'string' }),
  resolution: varchar('resolution').$type<ResolutionType>(),
  report: varchar('report'),
  performerId: cuid2('performer_id').references(() => users.id),
  listId: cuid2('list_id').notNull().references(() => taskLists.id),
})

export const taskLists = pgTable('task_lists', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  isArchived: boolean('is_archived').notNull().default(false),
  chatId: cuid2('chat_id').unique(),
})

export const taskAutoCreators = pgTable('task_auto_creators', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  cron: varchar('cron').notNull(),
  templateTitle: varchar('template_title').notNull(),
  templateDescription: varchar('template_description'),
  templateDate: varchar('template_date'),
  listId: cuid2('list_id').notNull().references(() => taskLists.id),
  performerId: cuid2('performer_id').references(() => users.id),
})

export const notifications = pgTable('notifications', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  type: varchar('type').notNull().$type<NotificationType>(),
  title: varchar('title').notNull(),
  description: varchar('description').notNull(),
  userId: cuid2('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  taskId: cuid2('task_id').references(() => tasks.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const checkouts = pgTable('checkouts', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  status: varchar('status').notNull().$type<CheckoutStatus>(),
  deliveryMethod: varchar('delivery_method').notNull().$type<CheckoutDeliveryMethod>(),
  itemsPrice: numeric('items_price', { mode: 'number' }).notNull().default(0),
  deliveryPrice: numeric('delivery_price', { mode: 'number' }).notNull().default(0),
  totalPrice: numeric('total_price', { mode: 'number' }).notNull().default(0),
  name: varchar('name'),
  phone: varchar('phone'),
  note: varchar('note'),
  street: varchar('street'),
  flat: varchar('flat'),
  intercom: varchar('intercom'),
  entrance: varchar('entrance'),
  floor: varchar('floor'),
  addressNote: varchar('address_note'),
  cashAmount: integer('cash_amount'),
  kitchenId: cuid2('kitchen_id').notNull().references(() => kitchens.id),
  paymentMethodId: cuid2('payment_method_id').references(() => paymentMethods.id),
})

export const checkoutItems = pgTable('checkout_items', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: numeric('unit_price', { mode: 'number' }).notNull().default(0),
  totalPrice: numeric('total_price', { mode: 'number' }).notNull().default(0),
  productVariantId: cuid2('product_variant_id').notNull().references(() => productVariants.id),
  checkoutId: cuid2('checkout_id').notNull().references(() => checkouts.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const kitchens = pgTable('kitchens', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  address: varchar('address'),
  city: varchar('city'),
  latitude: numeric('latitude', { mode: 'number' }),
  longitude: numeric('longitude', { mode: 'number' }),
  minAmountForDelivery: numeric('min_amount_for_delivery', { mode: 'number' }),
  isDeliveryAvailable: boolean('is_delivery_available').notNull().default(true),
  isPickupAvailable: boolean('is_pickup_available').notNull().default(true),
  rating: numeric('rating', { mode: 'number' }).notNull().default(0),
  partnerId: cuid2('partner_id').references(() => partners.id),
})

export const channels = pgTable('channels', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  type: varchar('type').notNull().$type<ChannelType>(),
})

export const channelKitchens = pgTable('channel_kitchens', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  kitchenId: cuid2('kitchen_id').notNull().references(() => kitchens.id),
  channelId: cuid2('channel_id').notNull().references(() => channels.id),
})

export const paymentMethods = pgTable('payment_methods', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  type: varchar('type').notNull().$type<PaymentMethodType>(),
})

export const paymentMethodsOnKitchens = pgTable('payment_methods_on_kitchens', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  kitchenId: cuid2('kitchen_id').notNull().references(() => kitchens.id),
  paymentMethodId: cuid2('payment_method_id').notNull().references(() => paymentMethods.id),
})

export const cities = pgTable('cities', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  code: varchar('code').notNull(),
  name: varchar('name').notNull(),
  storefrontUrl: varchar('storefront_url'),
  latitude: numeric('latitude', { mode: 'number' }),
  longitude: numeric('longitude', { mode: 'number' }),
})

export const posts = pgTable('posts', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  publishAt: timestamp('publish_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
  status: varchar('status').notNull().$type<PostStatus>(),
  type: varchar('type').notNull().$type<PostType>(),
  url: varchar('url'),
  description: varchar('description'),
  content: text('content'),
  authorId: cuid2('author_id').references(() => users.id),
  mediaId: cuid2('media_id').references(() => media.id),
})

export const postLikes = pgTable('post_likes', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  postId: cuid2('post_id').notNull().references(() => posts.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: cuid2('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const postComments = pgTable('post_comments', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  text: varchar('text').notNull(),
  postId: cuid2('post_id').notNull().references(() => posts.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: cuid2('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const files = pgTable('files', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  url: varchar('url').notNull(),
  size: integer('size').notNull(),
  format: varchar('format').notNull().$type<FileFormat>(),
})

export const prints = pgTable('prints', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  importantInfo: varchar('important_info'),
  technicalInfo: varchar('technical_info'),
  regularAmount: integer('regular_amount').notNull().default(0),
  mainFileId: cuid2('main_file_id').references(() => files.id),
  previewFileId: cuid2('preview_file_id').references(() => files.id),
})

export const printOrders = pgTable('print_orders', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const printOrderItems = pgTable('print_order_items', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  printOrderId: cuid2('print_order_id').notNull().references(() => printOrders.id),
  printId: cuid2('print_id').notNull().references(() => prints.id),
  note: varchar('note'),
})

export const feedbackPoints = pgTable('feedback_points', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  type: varchar('type').notNull().$type<FeedbackPointType>(),
  rating: numeric('rating', { mode: 'number' }).notNull().default(0),
  ratings: integer('ratings').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  url: varchar('url'),
  kitchenId: cuid2('kitchen_id').notNull().references(() => kitchens.id),
})

export const clientReviews = pgTable('client_reviews', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  name: varchar('name').notNull(),
  text: varchar('text').notNull(),
  rating: numeric('rating', { mode: 'number' }).notNull().default(0),
  url: varchar('url'),
  kitchenId: cuid2('kitchen_id').references(() => kitchens.id),
  feedbackPointId: cuid2('feedback_point_id').references(() => feedbackPoints.id),
})

export const userRelations = relations(users, ({ many, one }) => ({
  chatMessages: many(chatMessages),
  chatMembers: many(chatMembers),
  notifications: many(notifications),
  tasks: many(tasks),
  taskLists: many(taskLists),
  focusedTask: one(tasks, {
    fields: [users.focusedTaskId],
    references: [tasks.id],
  }),
  postLikes: many(postLikes),
  postComments: many(postComments),
}))

export const partnerRelations = relations(partners, ({ many, one }) => ({
  kitchens: many(kitchens),
  legalEntity: one(partnerLegalEntities, {
    fields: [partners.legalEntityId],
    references: [partnerLegalEntities.id],
  }),
  activeAgreement: one(partnerAgreements, {
    fields: [partners.activeAgreementId],
    references: [partnerAgreements.id],
  }),
}))

export const partnerLegalEntityRelations = relations(partnerLegalEntities, ({ many }) => ({
  partners: many(partners),
  agreements: many(partnerAgreements),
}))

export const partnerAgreementRelations = relations(partnerAgreements, ({ one, many }) => ({
  legalEntity: one(partnerLegalEntities, {
    fields: [partnerAgreements.legalEntityId],
    references: [partnerLegalEntities.id],
  }),
  partners: many(partners),
}))

export const chatRelations = relations(chats, ({ many, one }) => ({
  messages: many(chatMessages),
  members: many(chatMembers),
  lastMessage: one(chatMessages, {
    fields: [chats.lastMessageId],
    references: [chatMessages.id],
  }),
  taskList: one(taskLists, {
    fields: [chats.taskListId],
    references: [taskLists.id],
  }),
}))

export const chatMessageRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}))

export const chatMemberRelations = relations(chatMembers, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMembers.chatId],
    references: [chats.id],
  }),
  user: one(users, {
    fields: [chatMembers.userId],
    references: [users.id],
  }),
}))

export const menuRelations = relations(menus, ({ many }) => ({
  categories: many(menuCategories),
}))

export const menuCategoryRelations = relations(menuCategories, ({ many, one }) => ({
  menu: one(menus, {
    fields: [menuCategories.menuId],
    references: [menus.id],
  }),
  products: many(productsInMenuCategories),
}))

export const productRelations = relations(products, ({ many, one }) => ({
  variants: many(productVariants),
  categories: many(productsInMenuCategories),
  media: one(media, {
    fields: [products.mediaId],
    references: [media.id],
  }),
  tags: many(productTagsOnProducts),
}))

export const productVariantRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  tags: many(productVariantTagsOnProductVariants),
}))

export const productsInMenuCategoriesRelations = relations(productsInMenuCategories, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [productsInMenuCategories.menuCategoryId],
    references: [menuCategories.id],
  }),
  product: one(products, {
    fields: [productsInMenuCategories.productId],
    references: [products.id],
  }),
  productVariants: many(productVariantsOnMenuCategories),
}))

export const productVariantsOnMenuCategoriesRelations = relations(productVariantsOnMenuCategories, ({ one }) => ({
  productInMenuCategory: one(productsInMenuCategories, {
    fields: [productVariantsOnMenuCategories.productInMenuCategoryId],
    references: [productsInMenuCategories.id],
  }),
  productVariant: one(productVariants, {
    fields: [productVariantsOnMenuCategories.productVariantId],
    references: [productVariants.id],
  }),
}))

export const productTagsOnProductsRelations = relations(productTagsOnProducts, ({ one }) => ({
  product: one(products, {
    fields: [productTagsOnProducts.productId],
    references: [products.id],
  }),
  productTag: one(productTags, {
    fields: [productTagsOnProducts.productTagId],
    references: [productTags.id],
  }),
}))

export const productVariantTagsOnProductVariantsRelations = relations(productVariantTagsOnProductVariants, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [productVariantTagsOnProductVariants.productVariantId],
    references: [productVariants.id],
  }),
  productVariantTag: one(productVariantTags, {
    fields: [productVariantTagsOnProductVariants.productVariantTagId],
    references: [productVariantTags.id],
  }),
}))

export const mediaRelations = relations(media, ({ many }) => ({
  items: many(mediaItems),
  posts: many(posts),
}))

export const mediaItemRelations = relations(mediaItems, ({ one }) => ({
  media: one(media, {
    fields: [mediaItems.mediaId],
    references: [media.id],
  }),
}))

export const taskRelations = relations(tasks, ({ one }) => ({
  performer: one(users, {
    fields: [tasks.performerId],
    references: [users.id],
  }),
  list: one(taskLists, {
    fields: [tasks.listId],
    references: [taskLists.id],
  }),
}))

export const taskListRelations = relations(taskLists, ({ many, one }) => ({
  tasks: many(tasks),
  chat: one(chats, {
    fields: [taskLists.chatId],
    references: [chats.id],
  }),
}))

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [notifications.taskId],
    references: [tasks.id],
  }),
}))

export const checkoutRelations = relations(checkouts, ({ many, one }) => ({
  items: many(checkoutItems),
  paymentMethod: one(paymentMethods, {
    fields: [checkouts.paymentMethodId],
    references: [paymentMethods.id],
  }),
  kitchen: one(kitchens, {
    fields: [checkouts.kitchenId],
    references: [kitchens.id],
  }),
}))

export const checkoutItemRelations = relations(checkoutItems, ({ one }) => ({
  checkout: one(checkouts, {
    fields: [checkoutItems.checkoutId],
    references: [checkouts.id],
  }),
  productVariant: one(productVariants, {
    fields: [checkoutItems.productVariantId],
    references: [productVariants.id],
  }),
}))

export const kitchenRelations = relations(kitchens, ({ many, one }) => ({
  channels: many(channelKitchens),
  checkouts: many(checkouts),
  paymentMethods: many(paymentMethodsOnKitchens),
  feedbackPoints: many(feedbackPoints),
  reviews: many(clientReviews),
  partner: one(partners, {
    fields: [kitchens.partnerId],
    references: [partners.id],
  }),
}))

export const channelRelations = relations(channels, ({ many }) => ({
  kitchens: many(channelKitchens),
}))

export const channelKitchenRelations = relations(channelKitchens, ({ one }) => ({
  channel: one(channels, {
    fields: [channelKitchens.channelId],
    references: [channels.id],
  }),
  kitchen: one(kitchens, {
    fields: [channelKitchens.kitchenId],
    references: [kitchens.id],
  }),
}))

export const paymentMethodRelations = relations(paymentMethods, ({ many }) => ({
  checkouts: many(checkouts),
  kitchens: many(paymentMethodsOnKitchens),
}))

export const paymentMethodsOnKitchenRelations = relations(paymentMethodsOnKitchens, ({ one }) => ({
  kitchen: one(kitchens, {
    fields: [paymentMethodsOnKitchens.kitchenId],
    references: [kitchens.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [paymentMethodsOnKitchens.paymentMethodId],
    references: [paymentMethods.id],
  }),
}))

export const postRelations = relations(posts, ({ one, many }) => ({
  media: one(media, {
    fields: [posts.mediaId],
    references: [media.id],
  }),
  likes: many(postLikes),
  comments: many(postComments),
}))

export const postLikeRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}))

export const postCommentRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}))

export const fileRelations = relations(files, ({ many }) => ({
  prints: many(prints),
}))

export const printRelations = relations(prints, ({ many, one }) => ({
  orders: many(printOrders),
  mainFile: one(files, {
    fields: [prints.mainFileId],
    references: [files.id],
  }),
  previewFile: one(files, {
    fields: [prints.previewFileId],
    references: [files.id],
  }),
}))

export const printOrderRelations = relations(printOrders, ({ many }) => ({
  items: many(printOrderItems),
}))

export const printOrderItemRelations = relations(printOrderItems, ({ one }) => ({
  printOrder: one(printOrders, {
    fields: [printOrderItems.printOrderId],
    references: [printOrders.id],
  }),
  print: one(prints, {
    fields: [printOrderItems.printId],
    references: [prints.id],
  }),
}))

export const feedbackPointRelations = relations(feedbackPoints, ({ one, many }) => ({
  kitchen: one(kitchens, {
    fields: [feedbackPoints.kitchenId],
    references: [kitchens.id],
  }),
  reviews: many(clientReviews),
}))

export const clientReviewRelations = relations(clientReviews, ({ one }) => ({
  feedbackPoint: one(feedbackPoints, {
    fields: [clientReviews.feedbackPointId],
    references: [feedbackPoints.id],
  }),
  kitchen: one(kitchens, {
    fields: [clientReviews.kitchenId],
    references: [kitchens.id],
  }),
}))
