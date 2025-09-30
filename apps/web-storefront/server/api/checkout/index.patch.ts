import { db } from '@roll-stack/database'
import { type } from 'arktype'
import { updateCheckoutSchema } from '~~/shared/services/checkout'

export default defineEventHandler(async (event) => {
  try {
    const { secure } = await getUserSession(event)
    if (!secure?.checkoutId) {
      throw createError({
        statusCode: 404,
        message: 'No checkout',
      })
    }

    const body = await readBody(event)
    const data = updateCheckoutSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    await db.checkout.recalculate(secure.checkoutId)

    const actualCheckout = await db.checkout.find(secure.checkoutId)

    const needToBecomeCreated: boolean = !!data.phone && !!data.name

    const minAmountForDelivery = 0

    if (needToBecomeCreated) {
      // Guard: If checkout.totalPrice < minAmountForDelivery
      if (actualCheckout?.deliveryMethod === 'delivery' && minAmountForDelivery) {
        if (actualCheckout.totalPrice < minAmountForDelivery) {
          throw createError({
            statusCode: 400,
            message: 'Minimum order value not reached',
          })
        }
      }

      await db.checkout.update(secure.checkoutId, {
        status: 'created',
      })

      const session = await getUserSession(event)
      await replaceUserSession(event, {
        ...session,
        secure: {
          ...secure,
          checkoutId: null,
        },
      })
    }

    const updatedCheckout = await db.checkout.update(secure.checkoutId, {
      ...data,
      // change: data.change?.toString(),
      // time: data.time ? new Date(data.time).toISOString() : new Date().toISOString(),
      // timeType: data.time ? 'SCHEDULED' : 'ASAP',
    })
    if (!updatedCheckout?.id) {
      throw createError({
        statusCode: 400,
        message: 'Failed to update checkout',
      })
    }

    await db.checkout.recalculate(secure.checkoutId)

    return {
      ok: true,
      result: updatedCheckout,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
