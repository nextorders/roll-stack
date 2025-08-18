<template>
  <Header :title="t('app.menu.prints')">
    <UButton
      size="lg"
      variant="solid"
      color="secondary"
      class="w-full md:w-fit"
      icon="i-lucide-circle-plus"
      :label="t('app.create.print.button')"
      @click="modalCreatePrint.open()"
    />
  </Header>

  <Content>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <div class="flex flex-row gap-2.5">
        <UInput
          v-model="filterValue"
          placeholder="По названию"
          class="max-w-sm"
          icon="i-lucide-search"
        />

        <!-- <UInput
          v-model="filterByTagValue"
          placeholder="По тегу"
          class="max-w-sm"
          icon="i-lucide-search"
        /> -->
      </div>

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
            trailing-icon="i-lucide-settings-2"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
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
      <!-- <template #media-cell="{ row }">
        <ULink :to="`/print/${row.getValue('id')}`">
          <div class="h-12 aspect-3/2 object-cover pl-0" data-media="true">
            <ProductImage :media="row.getValue('media')" size="xs" />
          </div>
        </ULink>
      </template> -->
      <template #name-cell="{ row }">
        <ULink :to="`/print/${row.getValue('id')}`" class="font-medium text-highlighted">
          {{ row.getValue('name') }}
        </ULink>
      </template>
      <template #description-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-64">
          {{ row.getValue('description') }}
        </div>
      </template>
      <template #importantInfo-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-64">
          {{ row.getValue('importantInfo') }}
        </div>
      </template>
      <template #technicalInfo-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-64">
          {{ row.getValue('technicalInfo') }}
        </div>
      </template>
      <template #action-cell="{ row }">
        <div class="flex items-end" data-action="true">
          <UDropdownMenu
            :items="getDropdownActions(row.original as Print)"
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
import type { Print } from '@roll-stack/database'
import { ModalCreatePrint } from '#components'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

const overlay = useOverlay()
const modalCreatePrint = overlay.create(ModalCreatePrint)

const { t } = useI18n()
const printStore = usePrintStore()

const filterValue = ref('')
// const filterByTagValue = ref('')

const data = computed<PrintWithData[]>(() => {
  const finalRows = printStore.prints.filter((p) => p.name.toLowerCase().includes(filterValue.value.toLowerCase()))

  // if (filterByTagValue.value) {
  //   finalRows = finalRows.filter((p) => p.tags.some((tag) => tag.name.toLowerCase().includes(filterByTagValue.value.toLowerCase())))
  // }

  return finalRows
})

const columnVisibility = ref({
  id: false,
})
const rowSelection = ref()
const pagination = ref({
  pageIndex: 0,
  pageSize: 25,
})

const columns: Ref<TableColumn<PrintWithData>[]> = ref([{
  accessorKey: 'id',
  header: 'Id',
},
// {
//   accessorKey: 'media',
//   enableSorting: false,
//   header: '',
// },
{
  accessorKey: 'name',
  header: 'Название',
}, {
  accessorKey: 'description',
  header: 'Описание',
}, {
  accessorKey: 'importantInfo',
  header: 'Важно',
}, {
  accessorKey: 'technicalInfo',
  header: 'Техническая информация',
}, {
  id: 'action',
  enableSorting: false,
  enableHiding: false,
}])

function getDropdownActions(print: Print): DropdownMenuItem[][] {
  return [
    [
      {
        type: 'label',
        label: t('common.actions'),
      },
      {
        label: t('common.open-page'),
        type: 'link',
        to: `/print/${print.id}`,
        icon: 'i-lucide-file',
      },
    ],
  ]
}

const table = useTemplateRef('table')

useHead({
  title: t('app.menu.prints'),
})
</script>
