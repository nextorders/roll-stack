import type { FlowItemDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { flowItems } from '../tables'

export class Flow {
  static async findItem(id: string) {
    return useDatabase().query.flowItems.findFirst({
      where: (item, { eq }) => eq(item.id, id),
    })
  }

  static async listItems() {
    return useDatabase().query.flowItems.findMany({
      orderBy: (items, { desc }) => desc(items.createdAt),
      limit: 500,
      with: {
        comments: {
          orderBy: (comments, { desc }) => desc(comments.createdAt),
        },
      },
    })
  }

  static async createItem(data: FlowItemDraft) {
    const [item] = await useDatabase().insert(flowItems).values(data).returning()
    return item
  }

  static async updateItem(id: string, data: Partial<FlowItemDraft>) {
    const [item] = await useDatabase()
      .update(flowItems)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(flowItems.id, id))
      .returning()
    return item
  }

  static async deleteItem(id: string) {
    return useDatabase().delete(flowItems).where(eq(flowItems.id, id))
  }
}
