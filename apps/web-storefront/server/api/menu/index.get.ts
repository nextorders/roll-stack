import { db } from '@roll-stack/database'

const menuId = 'qfsjfayy69dojc208jkjvswz'

class MenuCache {
  /**
   * Timestamp of the last channel update used for cache invalidation comparison
   */
  updatedAt: string | null = null

  /**
   * Maximum age of cache in seconds (default: 24 hours)
   */
  maxAge: number = 60 * 60 * 24

  /**
   * Determines if stale-while-revalidate caching strategy should be used
   * If false: data was changed => need to revalidate cache before sending response
   */
  swr: boolean = false

  /**
   * Determines if the cache should be invalidated based on channel updatedAt
   * @returns true if cache should be invalidated, false otherwise
   */
  async shouldInvalidateCache(): Promise<boolean> {
    const menu = await db.menu.checkIfUpdated(menuId)
    if (!menu) {
      return true
    }

    if (this.updatedAt !== menu.updatedAt) {
      this.updatedAt = menu.updatedAt
      return true
    }

    return false
  }
}

const cache = new MenuCache()

export default defineCachedEventHandler(async () => {
  return db.menu.find(menuId)
}, {
  swr: cache.swr,
  maxAge: cache.maxAge,
  shouldInvalidateCache: cache.shouldInvalidateCache,
})
