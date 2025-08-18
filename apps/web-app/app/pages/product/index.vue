<template>
  <Header :title="t('app.menu.products')" />

  <Content>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <div class="flex flex-row gap-2.5">
        <UInput
          v-model="filterValue"
          placeholder="По названию"
          class="max-w-sm"
          icon="i-lucide-search"
        />

        <UInput
          v-model="filterByTagValue"
          placeholder="По тегу"
          class="max-w-sm"
          icon="i-lucide-search"
        />
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
            icon="i-lucide-settings-2"
          />
        </UDropdownMenu>

        <UButton
          size="md"
          variant="solid"
          color="secondary"
          class="w-full md:w-fit"
          icon="i-lucide-circle-plus"
          :label="t('app.create.product.button')"
          @click="modalCreateProduct.open()"
        />
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
        th: 'py-1 bg-elevated/50 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default [&:has([data-media=true]))]:px-0 [&:has([data-media=true]))]:max-w-16 [&:has([data-action=true]))]:pr-0',
      }"
    >
      <template #id-cell="{ row }">
        {{ row.getValue('id') }}
      </template>
      <template #media-cell="{ row }">
        <ULink :to="`/product/${row.getValue('id')}`">
          <div class="h-12 aspect-3/2 object-cover pl-0" data-media="true">
            <ProductImage :media="row.getValue('media')" size="xs" />
          </div>
        </ULink>
      </template>
      <template #name-cell="{ row }">
        <ULink :to="`/product/${row.getValue('id')}`" class="font-medium text-highlighted">
          {{ row.getValue('name') }}
        </ULink>
      </template>
      <template #description-cell="{ row }">
        <div class="text-sm/4 whitespace-pre-wrap max-w-64">
          {{ row.getValue('description') }}
        </div>
      </template>
      <template #variants-cell="{ row }">
        <div class="flex flex-col gap-1">
          <div
            v-for="variant in (row.getValue('variants') as ProductVariantWithData[])"
            :key="variant.id"
            class="flex items-center gap-1.5"
          >
            <UBadge
              v-for="tag in variant.tags"
              :key="tag.id"
              color="neutral"
              variant="soft"
              size="sm"
              :label="tag.name"
            />

            <p class="text-sm">
              {{ `${variant.name}, ${variant.weightValue}${getWeightLocalizedUnit(variant.weightUnit)}, ${variant.gross}${menuStore.currencySign}` }}
            </p>
          </div>
        </div>
      </template>
      <template #tags-cell="{ row }">
        <ProductTagsBlock :tags="row.getValue('tags')" />
      </template>
      <template #action-cell="{ row }">
        <div class="flex items-end" data-action="true">
          <UDropdownMenu
            :items="getDropdownActions(row.original as Product)"
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
import type { Product } from '@roll-stack/database'
import { ModalCreateProduct } from '#components'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

const overlay = useOverlay()
const modalCreateProduct = overlay.create(ModalCreateProduct)

const { t } = useI18n()
const menuStore = useMenuStore()
const productStore = useProductStore()

const filterValue = ref('')
const filterByTagValue = ref('')

const data = computed<ProductWithData[]>(() => {
  let finalRows = productStore.products.filter((product) => product.name.toLowerCase().includes(filterValue.value.toLowerCase()))

  if (filterByTagValue.value) {
    finalRows = finalRows.filter((product) => product.tags.some((tag) => tag.name.toLowerCase().includes(filterByTagValue.value.toLowerCase())))
  }

  return finalRows
})

const columnVisibility = ref({
  id: false,
})
const rowSelection = ref()
const pagination = ref({
  pageIndex: 0,
  pageSize: 50,
})

const columns: Ref<TableColumn<ProductWithData>[]> = ref([{
  accessorKey: 'id',
  header: 'Id',
}, {
  accessorKey: 'media',
  enableSorting: false,
  header: '',
}, {
  accessorKey: 'name',
  header: 'Название',
}, {
  accessorKey: 'description',
  header: 'Описание',
}, {
  accessorKey: 'variants',
  header: 'Вариации продукта',
}, {
  accessorKey: 'tags',
  header: 'Теги',
}, {
  id: 'action',
  enableSorting: false,
  enableHiding: false,
}])

function getDropdownActions(product: Product): DropdownMenuItem[][] {
  return [
    [
      {
        type: 'label',
        label: t('common.actions'),
      }, {
        label: t('common.open-page'),
        type: 'link',
        to: `/product/${product.id}`,
        icon: 'i-lucide-cooking-pot',
      },
    ],
  ]
}

const table = useTemplateRef('table')

useHead({
  title: t('app.menu.products'),
})
</script>
