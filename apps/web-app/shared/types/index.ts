import type { FeedbackPoint, File, Kitchen, Media, MediaItem, Menu, MenuCategory, PartnerAgreement, Print, Product, ProductsInMenuCategory, ProductTag, ProductVariant, ProductVariantTag } from '@roll-stack/database'

export type ProductVariantWithData = ProductVariant & {
  tags: ProductVariantTag[]
}

export type ProductWithData = Product & {
  categories: ProductsInMenuCategory[]
  variants: ProductVariantWithData[]
  tags: ProductTag[]
  media: MediaWithItems | null
}

export type MenuWithData = Menu & {
  categories: (MenuCategory & {
    products: (Product & {
      variants: ProductVariant[]
      media: MediaWithItems | null
    })[]
  })[]
}

export type MediaWithItems = Media & {
  items: MediaItem[]
}

export type PrintWithData = Print & {
  mainFile: File | null
  previewFile: File | null
}

export type KitchenWithData = Kitchen & {
  feedbackPoints: FeedbackPoint[]
  agreement: PartnerAgreement | null
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export type UserGender = 'male' | 'female' | 'unknown'
