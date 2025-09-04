<template>
  <Content>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="filterValue"
        :placeholder="$t('common.filter')"
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
            trailing-icon="i-lucide-settings-2"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-filters="columnFilters"
      v-model:column-visibility="columnVisibility"
      v-model:pagination="pagination"
      :data="dataFiltered"
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
        td: 'border-b border-default [&:has([data-media=true]))]:px-0 [&:has([data-media=true]))]:max-w-10 [&:has([data-action=true]))]:pr-0',
      }"
    >
      <template #id-cell="{ row }">
        {{ row.getValue('id') }}
      </template>
      <template #menu-id-cell="{ row }">
        {{ row.getValue('menuId') }}
      </template>
      <template #menu-cell="{ row }">
        <ULink :to="`/menu/${menuStore.menus.find((menu) => menu.id === row.getValue('menuId'))?.id}`" class="font-medium text-highlighted">
          {{ menuStore.menus.find((menu) => menu.id === row.getValue('menuId'))?.name }}
        </ULink>
      </template>
      <template #name-cell="{ row }">
        <ULink :to="`/menu/${row.getValue('menuId')}/category/${row.getValue('id')}`" class="font-medium text-highlighted">
          {{ row.getValue('name') }}
        </ULink>
      </template>
      <template #action-cell="{ row }">
        <div class="flex items-end" data-action="true">
          <UDropdownMenu
            :items="getDropdownActions(row.original as MenuCategory)"
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
      <div class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} {{ t('common.table.rows-selected', table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0) }}
        {{ $t('common.table.rows-from') }} {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
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
import type { MenuCategory } from '@roll-stack/database'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

const { t } = useI18n()
const { params } = useRoute('product-productId-usage')
const actionToast = useActionToast()

const productStore = useProductStore()
const menuStore = useMenuStore()

const categories = computed(() => productStore.products.find((product) => product.id === params.productId)?.categories || [])
const filterValue = ref('')

const data = computed<MenuCategory[]>(() => menuStore.categories.filter((category) => categories.value.some((c) => c.menuCategoryId === category.id)))
const dataFiltered = computed(() => data.value.filter((category) => category.name.toLowerCase().includes(filterValue.value.toLowerCase())))

const columnFilters = ref([{
  id: 'id',
  value: '',
}])
const columnVisibility = ref({
  id: false,
  menuId: false,
})
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

const columns: Ref<TableColumn<MenuCategory>[]> = ref([{
  accessorKey: 'id',
  header: 'Id',
}, {
  accessorKey: 'menuId',
  enableSorting: false,
  header: 'Id меню',
}, {
  accessorKey: 'menu',
  header: t('app.menu.menu'),
}, {
  accessorKey: 'name',
  header: t('app.menu.menu-category'),
}, {
  id: 'action',
  enableSorting: false,
  enableHiding: false,
}])

function getDropdownActions(category: MenuCategory): DropdownMenuItem[][] {
  return [
    [
      {
        type: 'label',
        label: t('common.actions'),
      }, {
        label: t('common.open-page'),
        type: 'link',
        to: `/menu/${category.menuId}/category/${category.id}`,
        icon: 'i-lucide-notebook-text',
      },
      {
        label: t('common.detach'),
        icon: 'i-lucide-unlink',
        color: 'error',
        onSelect: () => detachProduct(category.id, params.productId),
      },
    ],
  ]
}

const table = useTemplateRef('table')

async function detachProduct(categoryId: string, productId: string) {
  const toastId = actionToast.start()

  try {
    await $fetch(`/api/menu/category/id/${categoryId}/product`, {
      method: 'DELETE',
      body: {
        productId,
        categoryId,
      },
    })

    await productStore.update()
    await menuStore.update()

    actionToast.success(toastId, t('toast.category-updated'))
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
