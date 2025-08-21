import { repository } from '@roll-stack/database'
import OpenAI from 'openai'
import { useAtriumBot } from '~~/server/services/telegram/atrium-bot'

export default defineTask({
  meta: {
    name: 'ai:daily-report',
    description: 'Prepare and post daily report to Telegram group',
  },
  async run() {
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
            content: 'Ты работаешь в компании "Суши Love", которая является сетью доставки суши. В 3-5 абзацах расскажи что сегодня было сделано, лучшие моменты. Отвечай на русском. Не бойся использовать emoji',
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

      await useAtriumBot().api.sendMessage(telegram.teamGroupId, finalMessage)
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})
