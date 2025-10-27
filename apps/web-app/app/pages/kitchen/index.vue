<template>
  <Header :title="t('app.menu.kitchens')" />

  <Content>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="filterValue"
        placeholder="По названию"
        class="max-w-sm"
        icon="i-lucide-search"
      />

      <div class="flex flex-wrap items-center gap-1.5">
        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => ({
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

        <UButton
          size="md"
          variant="solid"
          color="secondary"
          class="w-full md:w-fit"
          icon="i-lucide-upload"
          label="Добавить выручку"
          @click="modalUploadKitchenRevenue.open()"
        />
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
        th: 'py-1 bg-elevated/50 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default [&:has([data-action=true])]:pr-0',
      }"
    >
      <template #id-cell="{ row }">
        {{ row.getValue('id') }}
      </template>
      <template #rating-cell="{ row }">
        <UPopover
          mode="hover"
          :content="{
            align: 'center',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <FeedbackRating :rating="row.getValue('rating')" />

          <template #content>
            <div class="h-auto w-58 p-4 flex flex-col gap-2">
              <FeedbackPointsBlock :points="row.getValue('feedbackPoints')" />
            </div>
          </template>
        </UPopover>
      </template>
      <template #feedbackPoints-cell="">
        -
      </template>
      <template #name-cell="{ row }">
        <ULink :to="`/kitchen/${row.getValue('id')}`" class="font-medium text-highlighted">
          {{ row.getValue('name') }}
        </ULink>
      </template>
      <template #address-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-52">
          {{ row.getValue('address') }}, {{ row.getValue('city') }}
        </div>
      </template>
      <template #revenueForPreviousWeek-cell="{ row }">
        <div>{{ formatNumber(row.getValue('revenueForPreviousWeek')) }}</div>
      </template>
      <template #revenueForThisWeek-cell="{ row }">
        <div>{{ formatNumber(row.getValue('revenueForThisWeek')) }}</div>
      </template>
      <template #agreement-cell="{ row }">
        <div class="flex flex-row gap-2 items-center">
          <p class="font-medium text-highlighted">
            {{ row.original.agreement?.internalId }}
          </p>
          <UIcon
            v-if="row.original.agreement?.isActive"
            name="i-lucide-check"
            class="size-4 text-secondary"
          />
        </div>
      </template>
      <template #action-cell="{ row }">
        <div class="flex items-end" data-action="true">
          <UDropdownMenu
            :items="getDropdownActions(row.original as Kitchen)"
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
import type { Kitchen } from '@roll-stack/database'
import { ModalUploadKitchenRevenue } from '#components'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

const UButton = resolveComponent('UButton')

const { t } = useI18n()

const kitchenStore = useKitchenStore()

const filterValue = ref('')

const data = computed<KitchenWithData[]>(() => {
  return kitchenStore.kitchens.filter((k) => k.name.toLowerCase().includes(filterValue.value.toLowerCase()))
})

const columnVisibility = ref({
  id: false,
  feedbackPoints: false,
  city: false,
})
const rowSelection = ref()
const pagination = ref({
  pageIndex: 0,
  pageSize: 50,
})
const sorting = ref([
  {
    id: 'rating',
    desc: true,
  },
])

const columns: Ref<TableColumn<KitchenWithData>[]> = ref([{
  accessorKey: 'id',
  header: 'Id',
}, {
  accessorKey: 'rating',
  enableSorting: true,
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Рейтинг',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'feedbackPoints',
  header: 'Отзывы',
}, {
  accessorKey: 'name',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Название',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'address',
  header: 'Адрес',
}, {
  accessorKey: 'city',
  header: 'Населенный пункт',
}, {
  accessorKey: 'revenueForPreviousWeek',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Прошлая неделя',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'revenueForThisWeek',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    const icon = isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Текущая неделя',
      icon: isSorted ? icon : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  },
}, {
  accessorKey: 'agreement',
  header: '№ договора',
}, {
  id: 'action',
  enableSorting: false,
  enableHiding: false,
}])

function getDropdownActions(_: Kitchen): DropdownMenuItem[][] {
  return [
    [
      {
        type: 'label',
        label: t('common.actions'),
      },
      //  {
      //   label: t('common.open-page'),
      //   type: 'link',
      //   to: `/product/${product.id}`,
      //   icon: 'i-lucide-cooking-pot',
      // },
    ],
  ]
}

const table = useTemplateRef('table')

const overlay = useOverlay()
const modalUploadKitchenRevenue = overlay.create(ModalUploadKitchenRevenue)

useHead({
  title: t('app.menu.kitchens'),
})
</script>
