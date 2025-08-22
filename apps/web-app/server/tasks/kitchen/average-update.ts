import process from 'node:process'
import { repository } from '@roll-stack/database'

const logger = useLogger('kitchen:average-update')

export default defineTask({
  meta: {
    name: 'kitchen:average-update',
    description: 'Update average data of kitchens',
  },
  async run() {
    try {
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Skipping task in non-production environment')
        return { result: true }
      }

      const metrics = await repository.network.listMetrics()

      for (const m of metrics) {
        const allRevenuesThisPeriod = await repository.kitchen.listRevenuesForDate(m.date)
        if (!allRevenuesThisPeriod.length) {
          continue
        }

        const checks = allRevenuesThisPeriod.reduce((acc, curr) => acc + curr.checks, 0)
        const total = Math.round(allRevenuesThisPeriod.reduce((acc, curr) => acc + curr.total, 0))

        await repository.network.updateMetrics(m.id, {
          checks,
          total,
        })
      }
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
