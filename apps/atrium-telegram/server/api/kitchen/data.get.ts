import { TZDate } from '@date-fns/tz'

export default defineEventHandler(async () => {
  const openTime = '10:30'.split(':')
  const closeTime = '22:30'.split(':')

  const timezone = '+04:00'

  const openTimeDate = new TZDate(new Date(), timezone).setHours(Number(openTime[0]), Number(openTime[1]), 0)
  const closeTimeDate = new TZDate(new Date(), timezone).setHours(Number(closeTime[0]), Number(closeTime[1]), 0)

  const date = new TZDate(new Date(), timezone)

  // Calculate how many hours passed from opening to now
  const maxHours = 12
  let hoursWorkedForNow = maxHours
  if (date.getTime() > openTimeDate && date.getTime() < closeTimeDate) {
    hoursWorkedForNow = Math.floor((date.getTime() - openTimeDate) / 1000 / 60 / 60)
  }

  // Calculate orders for now
  let ordersForNow = 1265
  if (hoursWorkedForNow > 0) {
    ordersForNow = Math.round((ordersForNow / maxHours) * hoursWorkedForNow)
  }

  return {
    hoursWorkedForNow,
    ordersForNow,
  }
})
