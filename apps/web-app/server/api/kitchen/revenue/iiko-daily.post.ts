import type { Buffer } from 'node:buffer'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '#shared/services/file'
import { db } from '@roll-stack/database'
import xlsx from 'node-xlsx'

interface MultiPartData {
  data: Buffer
  name?: string
  filename?: string
  type?: string
}

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    if (!files?.length) {
      throw createError({
        statusCode: 400,
        message: 'Missing files',
      })
    }

    let rowsUpdated = 0
    const errors: string[] = []

    for (const file of files) {
      const res = await parseFileAndUpdateData(file)
      rowsUpdated += res.rowsUpdated
      errors.push(...res.errors)
    }

    return {
      ok: true,
      result: {
        rowsUpdated,
        errors,
      },
    }
  } catch (error) {
    throw errorResolver(error)
  }
})

async function parseFileAndUpdateData(file: MultiPartData) {
  const logger = useLogger('kitchen-revenue-iiko-daily')

  if (file.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 413,
      message: 'File too large',
    })
  }

  if (file.type && !ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type',
    })
  }

  const workSheetsFromFile = xlsx.parse(file.data.buffer)
  if (!workSheetsFromFile[0]) {
    throw createError({
      statusCode: 404,
      message: 'File not found',
    })
  }

  const data = workSheetsFromFile[0].data
  const dateRow = data[2] // 3rd row
  if (!dateRow || typeof dateRow[0] !== 'string' || !dateRow[0].startsWith('Дата')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid date',
    })
  }

  const dictionary = data[4] // 4th row - empty, 5th - column names
  if (!dictionary) {
    throw createError({
      statusCode: 400,
      message: 'Invalid dictionary',
    })
  }

  const indexOfName = dictionary.indexOf('Группа')
  const indexOfTotal = dictionary.indexOf('Сумма со скидкой, р.')
  const indexOfChecks = dictionary.indexOf('Чеков')
  if (!dictionary || indexOfName < 0 || indexOfTotal < 0 || indexOfChecks < 0) {
    throw createError({
      statusCode: 400,
      message: 'Invalid dictionary',
    })
  }

  const dateMatch = dateRow[0].match(/Дата:\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (!dateMatch) {
    throw createError({
      statusCode: 400,
      message: 'Invalid date format. Expected "Дата: DD.MM.YYYY"',
    })
  }

  const [, day, month, year] = dateMatch
  const dateOnly = `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`
  const date = new Date(`${dateOnly}T12:00:00.000Z`)

  if (Number.isNaN(date.getTime())) {
    throw createError({
      statusCode: 400,
      message: 'Invalid date values',
    })
  }

  // Remove first 5 rows and last row
  const dataRows = data.slice(5, data.length - 1)
  if (!dataRows) {
    throw createError({
      statusCode: 400,
      message: 'Invalid data',
    })
  }

  const parsedKitchens: { name: string, total: number, checks: number, averageCheck: number }[] = []

  for (const row of dataRows) {
    const name = row[indexOfName]
    const total = row[indexOfTotal]
    const checks = row[indexOfChecks]

    if (typeof name !== 'string' || typeof total !== 'number' || typeof checks !== 'number') {
      continue
    }

    const averageCheck = Math.round(total / checks)

    parsedKitchens.push({
      name,
      total,
      checks,
      averageCheck,
    })
  }

  // Update common data
  const averageCheck = Math.round(parsedKitchens.reduce((acc, curr) => acc + curr.averageCheck, 0) / parsedKitchens.length)
  const averageTotal = Math.round(parsedKitchens.reduce((acc, curr) => acc + curr.total, 0) / parsedKitchens.length)
  const checks = Math.round(parsedKitchens.reduce((acc, curr) => acc + curr.checks, 0))
  const total = Math.round(parsedKitchens.reduce((acc, curr) => acc + curr.total, 0))

  // Create or update metrics
  const metrics = await db.network.listMetrics()
  const existingMetrics = metrics.find((metric) => metric.date === dateOnly)
  if (!existingMetrics) {
    await db.network.createMetrics({
      date: dateOnly,
      checks,
      total,
      averageCheck,
      averageTotal,
    })
  } else {
    await db.network.updateMetrics(existingMetrics.id, {
      checks,
      total,
      averageCheck,
      averageTotal,
    })
  }

  // Every kitchen: find in DB and add amount for this day
  const kitchens = await db.kitchen.list()
  let rowsUpdated = 0
  const errors: string[] = []

  for (const kitchen of parsedKitchens) {
    const found = kitchens.find((k) => k.iikoAlias === kitchen.name)
    if (found) {
      // Create or update
      const revenue = await db.kitchen.findRevenueByKitchenAndDate(found.id, date)
      if (!revenue) {
        await db.kitchen.createRevenue({
          kitchenId: found.id,
          date: dateOnly,
          total: kitchen.total,
          checks: kitchen.checks,
          averageCheck: kitchen.averageCheck,
        })
      } else {
        await db.kitchen.updateRevenue(revenue.id, {
          total: kitchen.total,
          checks: kitchen.checks,
          averageCheck: kitchen.averageCheck,
        })
      }

      rowsUpdated++
      continue
    }

    logger.warn(`Kitchen "${kitchen.name}" from file not found`)
    errors.push(`"${kitchen.name}" не найдена.`)
  }

  logger.log(rowsUpdated, date, parsedKitchens)

  return {
    rowsUpdated,
    errors,
  }
}
