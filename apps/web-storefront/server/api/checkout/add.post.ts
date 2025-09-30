import type { Checkout } from '@roll-stack/database'
import type { H3Event } from 'h3'
import { db } from '@roll-stack/database'

const MAX_LINES_PER_CHECKOUT = 20

const isDeliveryAvailable = true

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body.productVariantId) {
      throw createError({
        statusCode: 400,
        message: 'Missing data',
      })
    }

    // Guard: If channel is not active or pickup/delivery is not available
    // if (!channel?.isActive || (!channel?.isPickupAvailable && !channel?.isDeliveryAvailable)) {
    //   throw createError({
    //     statusCode: 400,
    //     message: 'Channel is not active',
    //   })
    // }

    const session = await getUserSession(event)

    // Check if checkout already exists
    const checkoutId = session.secure?.checkoutId ?? await createCheckout(event)

    const checkoutInDB = await db.checkout.find(checkoutId)
    if (!checkoutInDB?.id) {
      // Clear session
      await replaceUserSession(event, {
        ...session,
        secure: {
          ...session.secure,
          checkoutId: null,
        },
      })

      throw createError({
        statusCode: 404,
        message: 'No checkout',
      })
    }

    // Add +1 or create new item
    const item = checkoutInDB.items.find((line) => line.productVariantId === body.productVariantId)
    if (!item) {
      // Check limit
      if (checkoutInDB.items?.length >= MAX_LINES_PER_CHECKOUT) {
        throw createError({
          statusCode: 400,
          message: 'Limit reached',
        })
      }

      // Create new
      await db.checkout.createItem({
        checkoutId,
        productVariantId: body.productVariantId,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        // undiscountedUnitPrice: 0,
        // undiscountedTotalPrice: 0,
        // isGift: false,
      })
    } else {
      // Add +1
      await db.checkout.updateItem(item.id, {
        quantity: item.quantity + 1,
      })
    }

    await db.checkout.recalculate(checkoutId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})

async function createCheckout(event: H3Event) {
  // Create new checkout
  const deliveryMethod: Checkout['deliveryMethod'] = isDeliveryAvailable ? 'delivery' : 'pickup'

  const createdCheckout = await db.checkout.create({
    status: 'forming',
    deliveryMethod,
    itemsPrice: 0,
    deliveryPrice: 0,
    totalPrice: 0,
    kitchenId: 'm68foq9qtpsxd69eayom7bjn', // Фрунзе
  })
  if (!createdCheckout?.id) {
    throw createError({
      statusCode: 400,
      message: 'Failed to create checkout',
    })
  }

  // Update user session
  const session = await getUserSession(event)
  await replaceUserSession(event, {
    ...session,
    secure: {
      ...session.secure,
      checkoutId: createdCheckout.id,
    },
  })

  return createdCheckout.id
}
