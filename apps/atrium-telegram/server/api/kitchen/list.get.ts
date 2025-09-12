import { TZDate } from '@date-fns/tz'
import { repository } from '@roll-stack/database'

export default defineEventHandler(async () => {
  const kitchens: KitchenWithData[] = await repository.kitchen.list() as KitchenWithData[]

  for (const kitchen of kitchens) {
    // const time = new TZDate(new Date(), kitchen.timezone).toLocaleString(locale, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

    const openTime = '10:30'.split(':')
    const closeTime = '22:30'.split(':')

    const date = new TZDate(new Date(), kitchen.timezone)
    kitchen.openTime = date.setHours(Number(openTime[0]), Number(openTime[1]), 0)
    kitchen.closeTime = date.setHours(Number(closeTime[0]), Number(closeTime[1]), 0)

    const timeNow = new TZDate(new Date(), kitchen.timezone).getTime()
    kitchen.isOpenedNow = timeNow >= kitchen.openTime && timeNow <= kitchen.closeTime
  }

  return kitchens
})
