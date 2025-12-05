export default defineEventHandler(async (event) => {
  try {
    const logger = useLogger('api:tilda:fila')

    const body = await readBody(event)

    logger.success(JSON.stringify(body, null, 2))

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
