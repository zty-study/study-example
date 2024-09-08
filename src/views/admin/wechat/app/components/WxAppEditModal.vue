<template>
  <a-modal
    :title="formModel.id ? '编辑应用' : '创建应用'"
    draggable
    title-align="start"
    v-model:visible="visible"
    unmount-on-close
    :render-to-body="false"
    :mask-closable="false"
    :align-center="false"
    :footer="false"
  >
    <a-form ref="formRef" :rules="rules" :model="formModel" auto-label-width autocomplete="off">
      <a-form-item field="name" label="名称" validate-trigger="blur">
        <a-input v-model="formModel.name" placeholder="请输入应用名称..." allowClear />
      </a-form-item>
      <a-form-item field="app_id" label="ID">
        <a-input v-model="formModel.app_id" placeholder="请输入应用ID..." allowClear />
      </a-form-item>

      <a-form-item field="secret" label="秘钥">
        <a-input v-model="formModel.secret" placeholder="请输入应用秘钥..." allowClear />
      </a-form-item>

      <a-form-item field="type" label="类型">
        <a-radio-group type="button" v-model="formModel.type">
          <a-radio value="weacc">公众号</a-radio>
          <a-radio value="applet">小程序</a-radio>
          <a-radio value="wecom">企业微信</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="logo" label="图标">
        <base-input-upload
          v-model:url="formModel.logo"
          placeholder="请输入图片url或上传"
          allowClear
        />
      </a-form-item>
    </a-form>
    <a-divider />

    <div class="flex-end g-15 mt-10">
      <a-button type="secondary" @click="visible = false">取消</a-button>
      <a-button type="primary" :loading="loading" @click="methods.handleSubmit">提交</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const formRef = ref()
const loading = ref(false)
const formModel = defineModel<Partial<Type.WxApp>>('form', { default: {} })
const visible = defineModel<boolean>('visible')
const emits = defineEmits(['refresh'])

const rules = computed(() => {
  return {
    name: { required: !formModel.value.id, message: '名称不能为空!' },
    app_id: { required: !formModel.value.id, message: '应用ID不能为空!', trigger: 'blur' },
    type: { required: !formModel.value.id, message: '应用类型不能为空!', trigger: 'change' },
    secret: { required: !formModel.value.id, message: '应用秘钥不能为空!' }
  }
})

const methods = {
  handleSubmit: () => {
    formRef.value?.validate(async (valid: boolean) => {
      if (valid) return
      if (formModel.value.id) {
        methods.handleEdit()
      } else {
        methods.handleCreate()
      }
    })
  },

  handleEdit: async () => {
    loading.value = true
    const { code, msg } = await useWxAppApi.update(formModel.value)
    loading.value = false
    if (code === 200) {
      ResMsg(code, msg)
      emits('refresh')
      visible.value = false
    }
  },

  handleCreate: async () => {
    loading.value = true
    const { code, msg } = await useWxAppApi.create(formModel.value)
    loading.value = false
    if (code === 200) {
      ResMsg(code, msg)
      emits('refresh')
      visible.value = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
