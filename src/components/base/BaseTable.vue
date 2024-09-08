<template>
  <div ref="tableRef" class="base-table-wrap flex-column h-100 g-20">
    <div class="base-table-header flex-yc flex-sb">
      <div class="flex-yc g-15" v-if="allowEdit || allowTrash || allowDelete || allowCreate">
        <a-button
          type="primary"
          size="small"
          @click="emits('create')"
          v-if="params.only_trashed !== true && allowEdit && allowCreate"
        >
          <IconFont class="mr-5" name="add-circle-fill" />
          <span>新建</span>
        </a-button>
        <a-button
          v-if="allowTrash"
          type="primary"
          size="small"
          status="warning"
          @click="methods.getTrashData"
        >
          <IconFont class="mr-5" name="recycle-fill" />
          <span>{{ params.only_trashed ? '退出回收站' : '回收站' }}</span>
        </a-button>

        <a-popconfirm
          content="确定将选中项移出回收站吗？"
          type="success"
          position="bottom"
          @ok="emits('restore')"
        >
          <a-button
            type="primary"
            size="small"
            status="success"
            v-if="params.only_trashed && allowTrash"
            :disabled="selected.length === 0"
          >
            <IconFont class="mr-5" name="restart-line" />
            <span>恢复</span>
          </a-button>
        </a-popconfirm>

        <a-popconfirm
          :content="
            allowTrash
              ? params.only_trashed
                ? '确定将选中项彻底删除吗？'
                : '确定将选中项移至回收站吗？'
              : '确定将选中项彻底删除吗？'
          "
          :type="params.only_trashed ? 'error' : 'warning'"
          position="bottom"
          @ok="emits('delete')"
        >
          <a-button
            v-if="allowDelete"
            type="primary"
            size="small"
            status="danger"
            :disabled="selected.length === 0"
          >
            <IconFont class="mr-5" name="delete-bin-fill" />
            <span>删除</span>
          </a-button>
        </a-popconfirm>
      </div>

      <div v-else>
        <slot name="head" />
      </div>

      <div class="flex-yc g-20 relative" ref="btnRef">
        <a-tooltip content="刷新" position="br" :popup-container="btnRef" mini>
          <IconFont @click="emits('refresh')" class="pointer" :size="18" name="refresh-line" />
        </a-tooltip>
        <a-tooltip
          :content="isFullscreen ? '退出全屏' : '全屏展示'"
          position="br"
          :popup-container="btnRef"
          mini
        >
          <IconFont
            v-if="!isFullscreen"
            @click="toggleFullScreen()"
            :size="18"
            class="pointer"
            name="fullscreen-line"
          />
          <IconFont
            v-else
            @click="toggleFullScreen()"
            :size="18"
            class="pointer"
            name="fullscreen-exit-line"
          />
        </a-tooltip>
      </div>
    </div>
    <a-table
      class="base-table-body flex-1 h-0"
      row-key="id"
      v-model:selectedKeys="selected"
      :row-selection="select ? rowSelection : undefined"
      :expandable="
        expandable
          ? {
              title: '＋'
            }
          : undefined
      "
      :stripe="stripe"
      :loading="loading"
      :columns="columns"
      :bordered="bordered"
      :data="data"
      :pagination="{
        size: 'small',
        ...pagination,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
        pageSizeOptions: [15, 20, 30, 50, 100]
      }"
      :scroll="{ x: '100%', y: '100%' }"
      @row-dblclick="methods.handleRowDblClick"
      @page-change="methods.handlePageChange"
      @page-size-change="methods.handlePageSizeChange"
    >
      <template #columns>
        <slot />
      </template>

      <template #expand-row="{ record }">
        <slot name="expand" :data="record" />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'

const btnRef = ref()
const tableRef = ref()
const cardRef = inject<Ref<HTMLElement>>('card')
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(cardRef)

const selected = defineModel<number[]>('selected', { default: [] })

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true
})

const pagination = defineModel<Global.Pagination>('pagination', {
  default: {
    current: 1,
    pageSize: 20,
    total: 0
  }
})

const params = defineModel<Partial<Type.QueryParams>>('params', {
  default: {}
})

withDefaults(
  defineProps<{
    data?: any[]
    select?: boolean
    loading?: boolean
    stripe?: boolean
    bordered?: boolean
    expandable?: boolean
    allowEdit?: boolean
    allowCreate?: boolean
    allowTrash?: boolean
    allowDelete?: boolean
    columns?: TableColumnData[]
  }>(),
  {
    loading: false,
    select: true,
    bordered: true,
    allowEdit: true,
    allowTrash: true,
    allowCreate: true,
    allowDelete: true,
    data: () => [],
    columns: () => []
  }
)

const emits = defineEmits(['refresh', 'delete', 'restore', 'create'])

defineExpose({
  full: isFullscreen
})

const methods = {
  handlePageChange: (page: number) => {
    pagination.value.current = page
    emits('refresh')
  },

  handlePageSizeChange: (size: number) => {
    pagination.value.current = 1
    pagination.value.pageSize = size
    emits('refresh')
  },

  getTrashData: () => {
    selected.value = []
    params.value.only_trashed = !params.value.only_trashed
    emits('refresh', !params.value.only_trashed)
  },

  handleRowDblClick: (record: any) => {
    if (selected.value.includes(record.id)) {
      selected.value.splice(selected.value.indexOf(record.id), 1)
    } else {
      selected.value.push(record.id)
    }
  }
}
</script>

<style lang="scss">
.base-table-wrap {
  .arco-trigger-content {
    white-space: nowrap;
  }

  .base-table-body {
    .arcp-spin {
      justify-content: space-between;
    }
  }
}
</style>
