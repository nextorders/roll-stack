import process from 'node:process'
import { repository } from '@roll-stack/database'

const logger = useLogger('task:auto-create')

export default defineTask({
  meta: {
    name: 'task:auto-create',
    description: 'Check if it is time to create a task',
  },
  async run() {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Skipping task in non-production environment')
      return { result: true }
    }

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000))

    try {
      const autoCreators = await repository.task.autoCreatorsList()

      for (const creator of autoCreators) {
        if (!isCronDue(creator.cron)) {
          continue
        }

        // If creator.templateDate is set, it will be 0 like in days
        // So, if we have 3, it will be 3 days from now
        // Date should be in 2025-05-21 format, without time
        const date = creator.templateDate ? new Date(new Date().getTime() + Number(creator.templateDate) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null

        const task = await repository.task.create({
          name: creator.templateTitle,
          description: creator.templateDescription,
          performerId: creator.performerId,
          listId: creator.listId,
          date,
        })

        logger.log(`Auto creator ${creator.id}: task created ${JSON.stringify(task)}`)
      }
    } catch (error) {
      errorResolver(error)
    }

    return { result: true }
  },
})

// Функция для проверки соответствия текущей даты cron-выражению
function isCronDue(cronString: string): boolean {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(' ')

  const now = new Date()

  const currentMinute = now.getMinutes()
  const currentHour = now.getHours()
  const currentDayOfMonth = now.getDate()
  const currentMonth = now.getMonth() + 1 // месяцы в JS начинаются с 0
  const currentDayOfWeek = now.getDay() // воскресенье = 0, суббота = 6

  // Проверяем соответствие каждой части
  const isMinuteMatch = (minute === '*' || minute === currentMinute.toString())
  const isHourMatch = (hour === '*' || hour === currentHour.toString())
  const isDayOfMonthMatch = (dayOfMonth === '*' || dayOfMonth === currentDayOfMonth.toString())
  const isMonthMatch = (month === '*' || month === currentMonth.toString())
  const isDayOfWeekMatch = (dayOfWeek === '*' || dayOfWeek === currentDayOfWeek.toString())

  return isMinuteMatch && isHourMatch && isDayOfMonthMatch && isMonthMatch && isDayOfWeekMatch
}
