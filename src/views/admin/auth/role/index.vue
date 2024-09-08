<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      :select="false"
      :allow-trash="false"
      :allow-delete="false"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
      @create="methods.handleCreate"
      @delete="methods.handleDelete"
    >
      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column
        title="名称"
        data-index="name"
        :min-width="140"
        ellipsis
        tooltip
      ></a-table-column>
      <a-table-column
        title="标识"
        data-index="value"
        :min-width="140"
        ellipsis
        tooltip
      ></a-table-column>
      <a-table-column
        title="备注"
        data-index="remark"
        :min-width="200"
        ellipsis
        tooltip
      ></a-table-column>
      <a-table-column
        title="更新时间"
        :width="200"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.update_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
      <a-table-column
        title="创建时间"
        :width="200"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.create_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
      <a-table-column title="操作" :width="138" fixed="right">
        <template #cell="{ record }">
          <a-button
            v-if="!params.only_trashed"
            size="mini"
            type="primary"
            :disabled="record.value === 'admin'"
            @click="methods.handleEdit(record)"
          >
            编辑
          </a-button>

          <a-popconfirm
            content="确定彻底删除这条数据吗？"
            :type="params.only_trashed ? 'error' : 'warning'"
            position="bottom"
            @ok="methods.handleDelete(record.name)"
          >
            <a-button
              class="ml-10"
              size="mini"
              :disabled="record.value === 'admin'"
              type="primary"
              status="danger"
            >
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </BaseTable>

    <RoleEditModal
      v-model:visible="visible"
      v-model:form="editParams"
      @refresh="methods.fetchData()"
    />
  </a-card>
</template>

<script setup lang="ts">
import { Helper } from '@/utils'

const cardRef = ref()
const visible = ref(false)
const baseTableRef = ref()
const selected = ref<number[]>([])
const loading = ref(false)
const tableData = ref<Type.Role[]>([])
const params: Partial<Type.QueryParams> = reactive({})
const editParams = ref<Partial<Type.Role>>({})

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
    const { code, data } = await useRoleApi.list({
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

  // 创建数据
  handleCreate: () => {
    editParams.value = {}
    visible.value = true
  },

  // 编辑数据
  handleEdit: (record: Type.Role) => {
    editParams.value = { ...record }
    visible.value = true
  },

  // 删除数据
  handleDelete: async (role: string) => {
    const { code, msg } = await useRoleApi.delete(role)
    if (code === 200) {
      ResMsg(code, msg)
      methods.fetchData()
    }
  }
}

methods.fetchData()
</script>

<style lang="scss" scoped></style>
