<template>
  <a-card ref="cardRef" class="system-config-card-wrap" title="系统配置" :bordered="false">
    <div class="flex-center">
      <div style="max-width: 600px" class="w-100">
        <a-form
          ref="formRef"
          class="my-20 w-100"
          :model="formModel"
          auto-label-width
          :rules="rules"
        >
          <a-form-item field="site_name" label="系统名称" validate-trigger="blur">
            <a-input v-model="formModel.site_name" placeholder="请输入系统名称..." allowClear />
          </a-form-item>
          <a-form-item field="logo" label="系统logo" validate-trigger="blur">
            <base-input-upload
              v-model:url="formModel.logo"
              placeholder="请输入图片url或上传"
              allowClear
            />
          </a-form-item>
          <a-form-item field="sub_title" label="系统副标题" validate-trigger="blur">
            <a-input v-model="formModel.sub_title" placeholder="请输入系统副标题..." allowClear />
          </a-form-item>
        </a-form>
        <div class="flex-end mb-20">
          <a-button type="primary" :loading="loading" @click="methods.handleSubmit"
            >提交保存</a-button
          >
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const formRef = ref()
const systemStore = useSystemStore()

const { loading, setLoading, toggleLoading } = useLoading()

const formModel: Partial<Type.SystemState> = reactive({
  logo: systemStore.logo,
  site_name: systemStore.site_name,
  sub_title: systemStore.sub_title
})

const rules = {
  site_name: [
    {
      required: true,
      message: '系统标题不能为空!'
    }
  ],
  logo: [
    {
      required: true,
      message: '系统logo不能为空!'
    }
  ]
}

const methods = {
  handleSubmit: async () => {
    setLoading(true)
    const { code, msg } = await useConfigApi.update({
      key: 'SITE-CONFIG',
      json: JSON.stringify(formModel)
    })
    toggleLoading()
    ResMsg(code, msg)
    if (code === 200) {
      systemStore.$patch(formModel)
    }
  }
}
</script>

<style lang="scss" scoped></style>
