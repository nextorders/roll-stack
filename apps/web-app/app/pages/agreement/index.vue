<template>
  <Header :title="t('app.menu.agreements')" />

  <Content>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="filterValue"
        placeholder="По номеру"
        class="max-w-sm"
        icon="i-lucide-search"
      />

      <div class="flex flex-wrap items-center gap-1.5">
        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                },
                onSelect(e?: Event) {
                  e?.preventDefault()
                },
              }))
          "
          :content="{ align: 'end' }"
        >
          <UButton
            :label="$t('common.columns')"
            color="neutral"
            variant="outline"
            icon="i-lucide-settings-2"
          />
        </UDropdownMenu>

        <UDropdownMenu
          :items="itemsForCreateButton"
          :content="{ align: 'end' }"
          class="ml-auto"
        >
          <UButton
            icon="i-lucide-plus"
            color="secondary"
            variant="solid"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      v-model:sorting="sorting"
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-default [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-1.5 text-sm/4 bg-elevated/50 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default [&:has([data-action=true]))]:pr-0',
      }"
    >
      <template #id-cell="{ row }">
        {{ row.getValue('id') }}
      </template>
      <template #internalId-cell="{ row }">
        <div class="flex flex-col gap-0.5">
          <div class="flex flex-row gap-2 items-center">
            <p class="text-base font-medium text-highlighted">
              {{ row.getValue('internalId') }}
            </p>
            <UIcon
              v-if="row.getValue('isActive')"
              name="i-lucide-check"
              class="size-4 text-secondary"
            />
          </div>
        </div>
      </template>
      <template #concludedAt-cell="{ row }">
        {{ format(new Date(row.getValue('concludedAt')), 'd MMMM yyyy', { locale: ru }) }}
      </template>
      <template #willEndAt-cell="{ row }">
        {{ format(new Date(row.getValue('willEndAt')), 'd MMMM yyyy', { locale: ru }) }}
      </template>
      <template #kitchens-cell="{ row }">
        <div class="flex flex-col gap-0.5 items-start">
          <ULink
            v-for="kitchen in row.original.kitchens"
            :key="kitchen.id"
            :to="`/kitchen/${kitchen.id}`"
            class="font-medium text-highlighted"
          >
            {{ kitchen.name }}
          </ULink>
        </div>
      </template>
      <template #legalEntity-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-40">
          {{ row.original.legalEntity?.name }}
        </div>
      </template>
      <template #files-cell="{ row }">
        <AgreementFilesBlock :files="row.original.files" />
      </template>
      <template #royalty-cell="{ row }">
        <div class="text-center">
          <div>{{ row.getValue('royalty') }}%</div>
          от {{ formatNumber(row.getValue('minRoyaltyPerMonth')) }}
        </div>
      </template>
      <template #marketingFee-cell="{ row }">
        <div v-if="row.getValue('marketingFee')" class="text-center">
          <div>{{ row.getValue('marketingFee') }}%</div>
          от {{ formatNumber(row.getValue('minMarketingFeePerMonth')) }}
        </div>
        <div v-else class="text-center">
          -
        </div>
      </template>
      <template #patentStatus-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-56">
          {{ getPatentStatus(row.getValue('patentStatus')) }}
        </div>
      </template>
      <template #comment-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-56">
          {{ row.getValue('comment') }}
        </div>
      </template>
      <template #action-cell="{ row }">
        <div class="flex items-end" data-action="true">
          <UDropdownMenu
            :items="getDropdownActions(row.original as PartnerAgreement)"
            :content="{ align: 'end' }"
            class="ml-auto"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="outline"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UTable>

    <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
      <div v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length" class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} {{ t('common.table.rows-selected', table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0) }}
        {{ $t('common.table.rows-from') }} {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
      </div>
      <div v-else class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} {{ t('common.table.rows', table?.tableApi?.getFilteredRowModel().rows.length || 0) }}
      </div>

      <div class="flex items-center gap-1.5">
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { PartnerAgreement } from '@roll-stack/database'
import type { PartnerAgreementWithAllData } from '~/stores/partner'
import { ModalCreatePartnerAgreement, ModalCreatePartnerLegalEntity, ModalUpdatePartnerAgreement } from '#components'
import { getPaginationRowModel } from '@tanstack/table-core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { upperFirst } from 'scule'

const UButton = resolveComponent('UButton')

const { t } = useI18n()

const filterValue = ref('')

const overlay = useOverlay()
const modalCreatePartnerAgreement = overlay.create(ModalCreatePartnerAgreement)
const modalUpdatePartnerAgreement = overlay.create(ModalUpdatePartnerAgreement)
const modalCreatePartnerLegalEntity = overlay.create(ModalCreatePartnerLegalEntity)

const partnerStore = usePartnerStore()

const data = computed<PartnerAgreementWithAllData[]>(() => {
  return partnerStore.agreements.filter((k) => k.internalId.toLowerCase().includes(filterValue.value.toLowerCase()))
})

const columnVisibility = ref({
  id: false,
  isActive: false,
  minRoyaltyPerMonth: false,
  minMarketingFeePerMonth: false,
})
const rowSelection = ref()
const pagination = ref({
  pageIndex: 0,
  pageSize: 100,
})
const sorting = ref([
  {
    id: 'concludedAt',
    desc: true,
  },
])

const columns: Ref<TableColumn<PartnerAgreementWithAllData>[]> = ref([{
  accessorKey: 'id',
  header: 'Id',
}, {
  accessorKey: 'internalId',
  enableSorting: true,
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: '№',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'concludedAt',
  enableSorting: true,
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Заключен',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'willEndAt',
  enableSorting: true,
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Заканчивается',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'kitchens',
  header: 'Кухни',
}, {
  accessorKey: 'files',
  header: 'Файлы',
}, {
  accessorKey: 'legalEntity',
  header: 'Юр. лицо',
}, {
  accessorKey: 'royalty',
  header: 'Роялти',
}, {
  accessorKey: 'minRoyaltyPerMonth',
  header: 'Мин. роялти',
}, {
  accessorKey: 'marketingFee',
  header: 'Маркетинговый сбор',
}, {
  accessorKey: 'patentStatus',
  header: 'Роспатент',
}, {
  accessorKey: 'minMarketingFeePerMonth',
  header: 'Мин. маркетинговый сбор',
}, {
  accessorKey: 'comment',
  header: 'Комментарий',
}, {
  accessorKey: 'isActive',
  header: 'Активен',
}, {
  id: 'action',
  enableSorting: false,
  enableHiding: false,
}])

function getDropdownActions(agreement: PartnerAgreement): DropdownMenuItem[][] {
  return [
    [
      {
        label: t('common.edit'),
        type: 'link',
        onSelect: () => modalUpdatePartnerAgreement.open({ agreementId: agreement.id }),
        icon: 'i-lucide-pencil',
      },
    ],
  ]
}

const itemsForCreateButton = computed<DropdownMenuItem[]>(() => [
  {
    label: t('app.create.partner-legal-entity.button'),
    type: 'link',
    onSelect: () => modalCreatePartnerLegalEntity.open(),
    icon: 'i-lucide-scale',
  },
  {
    label: t('app.create.agreement.button'),
    type: 'link',
    onSelect: () => modalCreatePartnerAgreement.open(),
    icon: 'i-lucide-scroll-text',
  },
])

const table = useTemplateRef('table')

useHead({
  title: t('app.menu.agreements'),
})
</script>
