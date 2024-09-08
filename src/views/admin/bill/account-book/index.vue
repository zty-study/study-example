<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      :allow-create="false"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
      @restore="methods.handleRestore"
      @delete="methods.handleDelete"
    >
      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column title="名称" data-index="name" :width="150" ellipsis tooltip />
      <a-table-column title="用户" data-index="user.nickname" :width="150" ellipsis tooltip />
      <a-table-column title="uid" data-index="uid" :width="150" ellipsis tooltip />
      <a-table-column
        title="更新时间"
        :width="160"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.update_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
      <a-table-column
        title="创建时间"
        :width="160"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.create_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
      <a-table-column title="操作" :width="params.only_trashed ? 130 : 70" fixed="right">
        <template #cell="{ record }">
          <a-button
            v-if="params.only_trashed"
            size="mini"
            type="primary"
            status="success"
            @click="methods.handleRestore([record.id])"
          >
            恢复
          </a-button>

          <a-popconfirm
            :content="
              params.only_trashed ? '确定彻底删除这条数据吗？' : '确定将该条数据移至回收站吗？'
            "
            :type="params.only_trashed ? 'error' : 'warning'"
            position="bottom"
            @ok="methods.handleDelete([record.id])"
          >
            <a-button class="ml-10" size="mini" type="primary" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </BaseTable>
  </a-card>
</template>

<script setup lang="ts">
import { Helper } from '@/utils'
import { GenderMap } from '@/utils/constant/map'

const cardRef = ref()
const avatar = ref()
const baseTableRef = ref()
const preview = ref(false)
const selected = ref<number[]>([])
const loading = ref(false)
const tableData = ref<Type.IBillAccountBook[]>([])
const params: Partial<Type.QueryParams> = reactive({})

const pagination: Global.Pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

provide('card', cardRef)

const methods = {
  // 获取数据
  fetchData: async () => {
    loading.value = true
    selected.value = []
    const { code, data } = await useBillAccountBookApi.list({
      page: pagination.current,
      limit: pagination.pageSize,
      ...params
    })
    loading.value = false
    if (code === 200) {
      pagination.total = data.total
      tableData.value = data.data
    } else {
      tableData.value = []
    }
  },

  // 恢复数据
  handleRestore: async (ids?: number[]) => {
    const { code, msg } = await useBillAccountBookApi.restore(ids || selected.value)
    if (code === 200) {
      methods.fetchData()
      ResMsg(code, msg)
    }
  },

  // 删除数据
  handleDelete: async (ids?: number[]) => {
    if (params.only_trashed) {
      const { code, msg } = await useBillAccountBookApi.delete(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    } else {
      const { code, msg } = await useBillAccountBookApi.remove(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    }
  },

  handlePreview: (url?: string) => {
    avatar.value = url
    preview.value = true
  }
}

methods.fetchData()
</script>

<style lang="scss" scoped></style>
