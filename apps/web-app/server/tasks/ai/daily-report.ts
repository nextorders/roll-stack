import process from 'node:process'
import { repository } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import OpenAI from 'openai'
import { useAtriumBot } from '~~/server/services/telegram/atrium-bot'

const logger = useLogger('task:ai:daily-report')

export default defineTask({
  meta: {
    name: 'ai:daily-report',
    description: 'Prepare and post daily report to Telegram group',
  },
  async run() {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Skipping task in non-production environment')
      return { result: true }
    }

    try {
      const { ai, telegram } = useRuntimeConfig()

      const tasks = await repository.task.listCompletedToday()
      const preparedTasks = tasks.map((task) => ({
        completedAt: task.completedAt,
        name: task.name,
        description: task.description,
        report: task.report,
      }))

      const client = new OpenAI({
        apiKey: ai.apiKey,
        baseURL: ai.baseUrl,
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
      await repository.flow.createItem({
        type: 'daily_task_report',
        title: `Задачи ${date}`,
        description: finalMessage,
      })

      await useAtriumBot().api.sendMessage(telegram.teamGroupId, finalMessage)
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
