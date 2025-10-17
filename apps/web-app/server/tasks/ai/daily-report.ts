import process from 'node:process'
import { db } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import OpenAI from 'openai'

const logger = useLogger('task:ai:daily-report')

export default defineTask({
  meta: {
    name: 'ai:daily-report',
    description: 'Prepare and post daily report',
  },
  async run() {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Skipping task in non-production environment')
      return { result: true }
    }

    try {
      const { ai } = useRuntimeConfig()

      const tasks = await db.task.listCompletedToday()
      const preparedTasks = tasks.map((task) => ({
        completedAt: task.completedAt,
        name: task.name,
        description: task.description,
        report: task.report,
      }))

      const client = new OpenAI({
        apiKey: ai.apiKey,
        baseURL: ai.baseUrl,
        timeout: 120000,
        maxRetries: 2,
      })

      const response = await client.chat.completions.create({
        model: ai.modelPro,
        messages: [
          {
            role: 'system',
            content: ai.dailyReportPrompt,
          },
          {
            role: 'user',
            content: JSON.stringify(preparedTasks),
          },
        ],
      })

      const finalMessage = response.choices[0].message.content
      if (!finalMessage) {
        return { result: true }
      }

      // Flow item
      const date = format(new Date(), 'd MMMM', { locale: ru })
      await db.flow.createItem({
        type: 'daily_task_report',
        title: `Задачи ${date}`,
        description: finalMessage,
      })
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
