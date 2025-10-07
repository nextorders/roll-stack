import { Buffer } from 'node:buffer'
import { timingSafeEqual } from 'node:crypto'
import { Agent, OpenAIChatCompletionsModel, run } from '@openai/agents'
import OpenAI from 'openai'
import { getPartnersByCityTool, getPartnersBySurnameTool, getPartnersCountTool } from '~~/server/services/tools'

export default defineEventHandler(async (event) => {
  try {
    const { ai } = useRuntimeConfig()

    // Requires bearer token
    const bearer = getHeader(event, 'authorization')
    if (!bearer?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const token = bearer.slice(7) // Remove 'Bearer ' prefix
    if (!ai.serviceToken || !timingSafeEqual(Buffer.from(token), Buffer.from(ai.serviceToken))) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const body = await readBody(event)
    if (!body?.message) {
      throw createError({
        statusCode: 400,
        message: 'Message is required',
      })
    }

    const client = new OpenAI({
      apiKey: ai.apiKey,
      baseURL: ai.baseUrl,
    })

    const agent = new Agent({
      name: 'Дата агент сети доставок "Суши Love"',
      instructions: 'У тебя есть доступ к данным партнеров сети. Отвечай всегда на русском в мужском роде.',
      model: new OpenAIChatCompletionsModel(client as any, ai.model),
      tools: [
        getPartnersByCityTool,
        getPartnersBySurnameTool,
        getPartnersCountTool,
      ],
    })

    const result = await run(agent, body.message)

    return {
      ok: true,
      message: result.finalOutput,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
