import type { FlowItemCommentDraft, FlowItemDraft, FlowItemViewDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { flowItemComments, flowItems, flowItemViews } from '../tables'

export class Flow {
  static async findItem(id: string) {
    return useDatabase().query.flowItems.findFirst({
      where: (item, { eq }) => eq(item.id, id),
      with: {
        comments: {
          orderBy: (comments, { desc }) => desc(comments.createdAt),
        },
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

  static async listHubItems() {
    return useDatabase().query.flowItems.findMany({
      where: (items, { eq, or }) => or(
        eq(items.type, 'hub_iframe'),
        eq(items.type, 'hub_post'),
      ),
      orderBy: (items, { desc }) => desc(items.createdAt),
      limit: 100,
      with: {
        comments: {
          orderBy: (comments, { desc }) => desc(comments.createdAt),
          with: {
            user: true,
          },
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
    const exist = await useDatabase().query.flowItemViews.findFirst({
      where: (view, { eq, and }) => and(eq(view.userId, data.userId), eq(view.itemId, data.itemId)),
    })
    if (exist) {
      return exist
    }

    const [view] = await useDatabase().insert(flowItemViews).values(data).returning()
    return view
  }

  static async createItemComment(data: FlowItemCommentDraft) {
    const [comment] = await useDatabase().insert(flowItemComments).values(data).returning()
    return comment
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
