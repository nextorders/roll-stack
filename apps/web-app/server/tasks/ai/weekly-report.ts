import process from 'node:process'
import { repository } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import OpenAI from 'openai'

const logger = useLogger('task:ai:weekly-report')

export default defineTask({
  meta: {
    name: 'ai:weekly-report',
    description: 'Prepare and post weekly report',
  },
  async run() {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Skipping task in non-production environment')
      return { result: true }
    }

    try {
      const { ai } = useRuntimeConfig()

      const tasks = await repository.task.listCompletedThisWeek()
      const staff = await repository.user.findStaff()

      function preparePerformer(performerId: string | null) {
        const user = staff.find((user) => user.id === performerId)
        if (!user) {
          return null
        }

        return {
          name: user?.name,
          surname: user?.surname,
          caption: user?.caption,
          completedTasksCount: tasks.filter((task) => task.performerId === user?.id).length,
        }
      }

      const preparedTasks = tasks.map((task) => {
        const performer = preparePerformer(task.performerId)

        return {
          completedAt: task.completedAt,
          name: task.name,
          description: task.description,
          report: task.report,
          performer,
        }
      })

      const client = new OpenAI({
        apiKey: ai.apiKey,
        baseURL: ai.baseUrl,
      })

      const response = await client.chat.completions.create({
        model: ai.modelPro,
        messages: [
          {
            role: 'system',
            content: ai.weeklyReportPrompt,
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
      const week = format(new Date(), 'w', { locale: ru })
      await repository.flow.createItem({
        type: 'weekly_task_report',
        title: `Задачи за неделю ${week}`,
        description: finalMessage,
      })
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
