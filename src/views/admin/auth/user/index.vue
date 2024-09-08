<template>
  <a-card ref="cardRef" class="base-table-card-wrap relative" :bordered="false">
    <div id="preview"></div>
    <BaseTable
      ref="baseTableRef"
      :data="tableData"
      :loading="loading"
      v-model:params="params"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @refresh="methods.fetchData"
      @create="methods.handleCreate"
      @restore="methods.handleRestore"
      @delete="methods.handleDelete"
    >
      <a-table-column title="#" :width="50" align="center">
        <template #cell="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column title="账号" data-index="account" :width="120" ellipsis tooltip>
      </a-table-column>
      <a-table-column title="昵称" data-index="nickname" :width="180" ellipsis tooltip>
      </a-table-column>
      <a-table-column title="头像" :width="120" align="center">
        <template #cell="{ record }">
          <a-avatar
            class="pointer"
            object-fit="cover"
            :image-url="record.avatar"
            :size="35"
            @click="methods.handlePreview(record.avatar)"
          >
            {{ record.nickname }}
          </a-avatar>
        </template>
      </a-table-column>
      <a-table-column title="性别" :width="100" align-center>
        <template #cell="{ record }">
          <a-tag :color="GenderMap[record.gender]?.color">{{
            GenderMap[record.gender]?.label
          }}</a-tag>
        </template>
      </a-table-column>
      <a-table-column title="邮箱" data-index="email" :min-width="200" ellipsis tooltip>
      </a-table-column>
      <a-table-column title="角色" data-index="role_info.name" :width="120" ellipsis tooltip>
        <template #cell="{ record }">
          {{ record.role_info?.name || '-' }}
        </template>
      </a-table-column>
      <a-table-column
        title="上次登录"
        :width="160"
        :sortable="{ sortDirections: ['ascend', 'descend'] }"
      >
        <template #cell="{ record }">
          {{ Helper.time.format(record.login_time, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </a-table-column>
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

    <UserEditModal
      v-model:visible="visible"
      v-model:form="editParams"
      @refresh="methods.fetchData()"
    />

    <a-image-preview
      v-if="cardRef"
      :popup-container="baseTableRef.full ? cardRef.$el : undefined"
      v-model:visible="preview"
      :src="avatar"
    />
  </a-card>
</template>

<script setup lang="ts">
import { Helper } from '@/utils'
import { GenderMap } from '@/utils/constant/map'

const cardRef = ref()
const visible = ref(false)
const avatar = ref()
const baseTableRef = ref()
const preview = ref(false)
const selected = ref<number[]>([])
const loading = ref(false)
const tableData = ref<Type.User[]>([])
const params: Partial<Type.QueryParams> = reactive({})
const editParams = ref<Partial<Type.User>>({
  account: undefined
})

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
    const { code, data } = await useUserApi.list({
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
  handleEdit: (record: Type.User) => {
    editParams.value = { ...record }
    visible.value = true
  },

  // 恢复数据
  handleRestore: async (ids?: number[]) => {
    const { code, msg } = await useUserApi.restore(ids || selected.value)
    if (code === 200) {
      methods.fetchData()
      ResMsg(code, msg)
    }
  },

  // 删除数据
  handleDelete: async (ids?: number[]) => {
    if (params.only_trashed) {
      const { code, msg } = await useUserApi.delete(ids || selected.value)
      if (code === 200) {
        methods.fetchData()
        ResMsg(code, msg)
      }
    } else {
      const { code, msg } = await useUserApi.remove(ids || selected.value)
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
