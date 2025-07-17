import { repository } from '@roll-stack/database'

const logger = useLogger('kitchen:rating-update')

export default defineTask({
  meta: {
    name: 'kitchen:rating-update',
    description: 'Update rating of kitchens',
  },
  async run() {
    try {
      const kitchens = await repository.kitchen.list()

      for (const kitchen of kitchens) {
        const points = kitchen.feedbackPoints.filter((point) => point.rating > 0 && point.reviews >= 5)
        const rawRating = points.reduce((acc, point) => acc + point.rating, 0) / points.length

        // Must be like 4.7
        const updatedRating = Math.round(rawRating * 10) / 10
        if (updatedRating === kitchen.rating) {
          continue
        }

        await repository.kitchen.update(kitchen.id, {
          rating: updatedRating,
        })

        logger.log(`Kitchen ${kitchen.id}: Rating updated from ${kitchen.rating} to ${updatedRating}`)
      }
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
