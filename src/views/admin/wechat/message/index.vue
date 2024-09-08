<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      :allow-create="false"
      :expandable="true"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
      @delete="methods.handleDelete"
      @restore="methods.handleRestore"
    >
      <template #expand="{ data }">
        <VueJsonPretty :theme="isDark ? 'dark' : 'light'" :data="JSON.parse(data.content)" />
      </template>

      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>

      <a-table-column title="应用" data-index="name" :width="180" ellipsis tooltip />
      <a-table-column title="类型" :width="150" align-center>
        <template #cell="{ record }">
          <a-tag v-if="record.type === 'weacc'" color="#22b95c"> 公众号 </a-tag>
          <a-tag v-else-if="record.type === 'applet'" color="#5d2bea"> 小程序 </a-tag>
          <a-tag v-else-if="record.type === 'wecom'" color="#3a7ebf"> 企业微信 </a-tag>
        </template>
      </a-table-column>
      <a-table-column title="应用ID" data-index="app_id" :width="220" ellipsis tooltip />
      <a-table-column title="消息内容" data-index="content" :min-width="200" ellipsis tooltip />
      <a-table-column
        title="创建时间"
        :width="200"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.create_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
      <a-table-column title="操作" :width="params.only_trashed ? 138 : 100" fixed="right">
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
  </a-card>
</template>

<script setup lang="ts">
import { Helper } from '@/utils'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const cardRef = ref()
const baseTableRef = ref()
const selected = ref<number[]>([])
const loading = ref(false)
const tableData = ref<Type.WxMsg[]>([])
const params: Partial<Type.QueryParams> = reactive({})

const pagination: Global.Pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const isDark = useDark()

provide('card', cardRef)

const methods = {
  // 获取数据
  fetchData: async () => {
    loading.value = true
    selected.value = []
    const { code, data } = await useWxMsgApi.list({
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

  // 删除数据
  // 删除数据
  handleDelete: async (ids?: number[]) => {
    if (params.only_trashed) {
      const { code, msg } = await useWxMsgApi.delete(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    } else {
      const { code, msg } = await useWxMsgApi.remove(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    }
  },

  // 恢复数据
  handleRestore: async (ids?: number[]) => {
    const { code, msg } = await useWxMsgApi.restore(ids || selected.value)
    if (code === 200) {
      methods.fetchData()
      ResMsg(code, msg)
    }
  }
}

methods.fetchData()
</script>

<style lang="scss"></style>
