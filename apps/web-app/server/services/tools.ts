import { tool } from '@openai/agents'
import { repository } from '@roll-stack/database'
import { z } from 'zod'

export const getPartnersCountTool = tool({
  name: 'get_partners_count',
  description: 'Get the number of partners',
  needsApproval: false,
  parameters: z.object({}),
  execute: async () => {
    const partners = await repository.partner.list()
    return partners.length
  },
})

export const getPartnersByCityTool = tool({
  name: 'get_partners_by_city',
  description: 'Get partners filtered by city name using case-insensitive partial matching',
  needsApproval: false,
  parameters: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    const partners = await repository.partner.list()
    return partners.filter((partner) => partner.city?.toLowerCase().includes(city.toLowerCase()))
  },
})

export const getPartnersBySurnameTool = tool({
  name: 'get_partners_by_surname',
  description: 'Get partners filtered by surname using case-insensitive partial matching',
  needsApproval: false,
  parameters: z.object({
    surname: z.string(),
  }),
  execute: async ({ surname }) => {
    const users = await repository.user.list()
    const partners = users.filter((user) => user.type === 'partner')
    return partners.filter((p) => p.surname?.toLowerCase().includes(surname.toLowerCase()))
  },
})
