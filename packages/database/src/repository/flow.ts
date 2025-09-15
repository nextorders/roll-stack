import type { FlowItemDraft, FlowItemViewDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { flowItems, flowItemViews } from '../tables'

export class Flow {
  static async findItem(id: string) {
    return useDatabase().query.flowItems.findFirst({
      where: (item, { eq }) => eq(item.id, id),
      with: {
        views: true,
      },
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
        views: true,
      },
    })
  }

  static async createItem(data: FlowItemDraft) {
    const [item] = await useDatabase().insert(flowItems).values(data).returning()
    return item
  }

  static async createItemView(data: FlowItemViewDraft) {
    const [view] = await useDatabase().insert(flowItemViews).values(data).returning()
    return view
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
