import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type * as tables from './tables'

export type { Database } from './connection'

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

export type ClientReview = InferSelectModel<typeof tables.clientReviews>
export type ClientReviewDraft = InferInsertModel<typeof tables.clientReviews>
