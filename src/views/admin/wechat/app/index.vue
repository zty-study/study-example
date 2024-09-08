<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      :expandable="true"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
      @create="methods.handleCreate"
      @restore="methods.handleRestore"
      @delete="methods.handleDelete"
    >
      <template #expand="{ data }">
        <a-descriptions :data="methods.tokenInfo(data)" title="令牌信息" :column="1" />
      </template>

      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column title="名称" data-index="name" :width="120" ellipsis tooltip />
      <a-table-column title="图标" :width="120" align="center">
        <template #cell="{ record }">
          <a-avatar
            class="pointer"
            shape="square"
            object-fit="cover"
            trigger-type="mask"
            :image-url="record.logo ? `${appStore.env?.APP_BASE_API}${record.logo}` : undefined"
            :size="35"
          >
            {{ record.name.substr(0, 2) }}
          </a-avatar>
        </template>
      </a-table-column>
      <a-table-column title="类型" :width="150" align-center>
        <template #cell="{ record }">
          <a-tag v-if="record.type === 'weacc'" color="#22b95c"> 公众号 </a-tag>
          <a-tag v-else-if="record.type === 'applet'" color="#5d2bea"> 小程序 </a-tag>
          <a-tag v-else-if="record.type === 'wecom'" color="#3a7ebf"> 企业微信 </a-tag>
        </template>
      </a-table-column>
      <a-table-column title="应用ID" data-index="app_id" :min-width="200" ellipsis tooltip />
      <a-table-column title="秘钥" data-index="secret" :min-width="200" ellipsis tooltip />
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
      <a-table-column title="操作" :width="138" fixed="right">
        <template #cell="{ record }">
          <a-button
            v-if="!params.only_trashed"
            size="mini"
            type="primary"
            @click="methods.handleEdit(record)"
          >
            编辑
          </a-button>
          <a-button
            v-else
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

    <WxAppEditModal
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
const tableData = ref<Type.WxApp[]>([])
const params: Partial<Type.QueryParams> = reactive({})
const editParams = ref<Partial<Type.WxApp>>({})

const appStore = useAppStore()

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
    const { code, data } = await useWxAppApi.list({
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
  handleEdit: (record: Type.WxApp) => {
    editParams.value = { ...record }
    visible.value = true
  },

  // 恢复数据
  handleRestore: async (ids?: number[]) => {
    const { code, msg } = await useWxAppApi.restore(ids || selected.value)
    if (code === 200) {
      methods.fetchData()
      ResMsg(code, msg)
    }
  },

  // 删除数据
  handleDelete: async (ids?: number[]) => {
    if (params.only_trashed) {
      const { code, msg } = await useWxAppApi.delete(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    } else {
      const { code, msg } = await useWxAppApi.remove(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    }
  },

  tokenInfo(data: any) {
    return [
      { label: '令牌状态', value: data.token_expire || 0 > Date.now() ? '正常' : '已过期' },
      {
        label: '过期时间',
        value: Helper.time.format(data.token_expire || 0, '{y}-{m}-{d} {h}:{i}')
      },
      { label: '令牌内容', value: data.token || '-' }
    ]
  }
}

methods.fetchData()
</script>

<style lang="scss" scoped></style>
