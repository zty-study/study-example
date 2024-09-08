<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      :select="false"
      :allow-delete="false"
      :allow-edit="false"
      :allow-create="false"
      :allow-trash="false"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
    >
      <template #head>
        <form class="flex-yc g-10" @submit.prevent="methods.handleSearch">
          <a-input-group>
            <a-cascader
              allow-clear
              path-mode
              v-model="cascader"
              check-strictly
              :options="ruleGroup"
              :style="{ width: '200px' }"
              expand-trigger="hover"
              placeholder="请选择分组"
            />
            <a-input
              style="min-width: 200px"
              allow-clear
              v-model="params.search"
              @press-enter="methods.handleSearch"
              placeholder="输入名称或路径搜索..."
            />
          </a-input-group>

          <a-button type="primary" @click="methods.handleSearch"
            ><IconFont class="mr-5" name="search-2-line" />搜索</a-button
          >
        </form>
      </template>

      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column title="名称" data-index="name" :min-width="140" ellipsis tooltip>
      </a-table-column>

      <a-table-column title="归属" :min-width="100" ellipsis tooltip>
        <template #cell="{ record }">
          {{ record.rule_group.name }}
        </template>
      </a-table-column>

      <a-table-column title="类型" data-index="method" :min-width="100">
        <template #cell="{ record }">
          <a-tag :color="RestfulMethodColorMap[record.method]"> {{ record.method }}</a-tag>
        </template>
      </a-table-column>

      <a-table-column title="路径" data-index="path" :min-width="300" ellipsis tooltip>
        <template #cell="{ record }">
          <a-tag>{{ record.path }}</a-tag>
        </template>
      </a-table-column>
    </BaseTable>

    <UserEditModal
      v-model:visible="visible"
      v-model:form="editParams"
      @refresh="methods.fetchData()"
    />
  </a-card>
</template>

<script setup lang="ts">
import { RestfulMethodColorMap } from '@/utils/constant/map'

const cardRef = ref()
const visible = ref(false)
const baseTableRef = ref()
const selected = ref<number[]>([])
const loading = ref(false)
const cascader = ref()
const tableData = ref<Type.Rule[]>([])
const ruleGroup = ref<Global.Options[]>([])
const editParams = ref<Partial<Type.User>>({
  account: undefined
})

const params = reactive({
  search: undefined
})

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
    let group = undefined
    let method = undefined
    if (cascader.value?.length > 0) {
      if (cascader.value.length === 1) {
        group = cascader.value[0]
      } else if (cascader.value.length === 2) {
        group = cascader.value[0]
        method = cascader.value[1]
      }
    }
    const { code, data } = await useRuleApi.list({
      page: pagination.current,
      limit: pagination.pageSize,
      group,
      method,
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

  getGroup: async () => {
    const { code, data } = await useRuleApi.group()
    if (code === 200) {
      ruleGroup.value = data.map((it) => {
        return {
          value: it.key,
          label: it.name,
          children: [
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'DELETE', label: 'DELETE' },
            { value: 'PATCH', label: 'PATCH' }
          ]
        }
      })
    }
  },

  handleSearch: () => {
    pagination.current = 1
    methods.fetchData()
  }
}

methods.fetchData()
methods.getGroup()
</script>

<style lang="scss">
.arco-cascader-panel {
  height: fit-content;
}
</style>
