import process from 'node:process'
import { db } from '@roll-stack/database'
import { endOfWeek, startOfWeek } from 'date-fns'

const logger = useLogger('kitchen:revenue-update')

export default defineTask({
  meta: {
    name: 'kitchen:revenue-update',
    description: 'Update weekly revenue of kitchens',
  },
  async run() {
    try {
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Skipping task in non-production environment')
        return { result: true }
      }

      const kitchens = await db.kitchen.list()

      // From this monday to sunday (use UTC+0 time zone)
      const now = new Date()
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)

      const thisMonday = startOfWeek(utcNow, { weekStartsOn: 1 })
      const thisSunday = endOfWeek(utcNow, { weekStartsOn: 1 })

      // Previous week
      const utcWeekAgo = new Date(utcNow.getTime() - 7 * 24 * 60 * 60 * 1000)
      const prevMonday = startOfWeek(utcWeekAgo, { weekStartsOn: 1 })
      const prevSunday = endOfWeek(utcWeekAgo, { weekStartsOn: 1 })

      for (const kitchen of kitchens) {
        const revenuesThisWeek = await db.kitchen.listRevenuesByKitchenForPeriod(kitchen.id, thisMonday, thisSunday)
        const revenuesPrevWeek = await db.kitchen.listRevenuesByKitchenForPeriod(kitchen.id, prevMonday, prevSunday)

        const revenueForThisWeek = Math.round(revenuesThisWeek.reduce((acc, curr) => acc + curr.total, 0))
        const revenueForPreviousWeek = Math.round(revenuesPrevWeek.reduce((acc, curr) => acc + curr.total, 0))

        if (revenueForThisWeek === kitchen.revenueForThisWeek && revenueForPreviousWeek === kitchen.revenueForPreviousWeek) {
          continue
        }

        await db.kitchen.update(kitchen.id, {
          revenueForThisWeek,
          revenueForPreviousWeek,
        })

        // logger.log(`Kitchen ${kitchen.id}: Revenue updated from ${kitchen.revenueForThisWeek} to ${revenueForThisWeek}`)
      }
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
