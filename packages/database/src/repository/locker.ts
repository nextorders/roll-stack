import { useDatabase } from '../database'

export class Locker {
  static async findItem(id: string) {
    return useDatabase().query.lockerItems.findFirst({
      where: (item, { eq }) => eq(item.id, id),
    })
  }

  static async listDuplicatesForUser(userId: string) {
    return useDatabase().query.lockerItemDuplicates.findMany({
      where: (duplicate, { eq }) => eq(duplicate.userId, userId),
      with: {
        item: true,
      },
    })
  }
}
