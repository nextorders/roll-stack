import type { Invoice, Kitchen, Partner, PartnerAgreement, PartnerAgreementFile, PartnerLegalEntity, User } from '@roll-stack/database'

export type PartnerAgreementWithAllData = PartnerAgreement & {
  files: PartnerAgreementFile[]
  legalEntity: PartnerLegalEntity | null
  kitchens: Kitchen[]
}

export type PartnerAgreementWithData = PartnerAgreement & {
  files: PartnerAgreementFile[]
}

export type PartnerLegalEntityWithData = PartnerLegalEntity & {
  agreements: PartnerAgreementWithData[]
}

export type PartnerWithData = Partner & {
  kitchens: Kitchen[]
  legalEntity: PartnerLegalEntityWithData | null
  users: User[]
  invoices: Invoice[]
}

export const usePartnerStore = defineStore('partner', () => {
  const partners = ref<PartnerWithData[]>([])
  const agreements = ref<PartnerAgreementWithAllData[]>([])
  const legalEntities = ref<PartnerLegalEntity[]>([])

  async function update() {
    try {
      const data = await $fetch('/api/partner/list')
      if (!data) {
        return
      }

      partners.value = data

      await Promise.all([
        updateAgreements(),
        updateLegalEntities(),
      ])
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function updateAgreements() {
    try {
      const data = await $fetch('/api/partner/agreement/list')
      if (!data) {
        return
      }

      agreements.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function updateLegalEntities() {
    try {
      const data = await $fetch('/api/partner/legal/list')
      if (!data) {
        return
      }

      legalEntities.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    partners,
    agreements,
    legalEntities,

    update,
  }
})
