import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userPoint = { lat: query.lat as number, lon: query.lon as number }

    if (!userPoint.lat || !userPoint.lon) {
      // check if numbers
      if (typeof userPoint.lat !== 'number' || typeof userPoint.lon !== 'number') {
        throw createError({
          statusCode: 400,
          message: 'Lat and lon must be numbers',
        })
      }

      throw createError({
        statusCode: 400,
        message: 'Lat and lon are required',
      })
    }

    const kitchens = await db.kitchen.list()

    const res: any[] = []

    for (const kitchen of kitchens) {
      if (!kitchen.latitude || !kitchen.longitude) {
        continue
      }

      const distance = calculateDistanceInMeters(userPoint, { lat: kitchen.latitude, lon: kitchen.longitude })

      res.push({
        ...kitchen,
        distance,
      })
    }

    return res
  } catch (error) {
    throw errorResolver(error)
  }
})

function calculateDistanceInMeters(point1: { lat: number, lon: number }, point2: { lat: number, lon: number }): number {
  const R = 6371e3 // m
  const φ1 = (point1.lat * Math.PI) / 180 // φ, λ in radians
  const φ2 = (point2.lat * Math.PI) / 180
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
  const Δλ = ((point2.lon - point1.lon) * Math.PI) / 180

  const a
    = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
      + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // m

  return Math.round(d)
}
