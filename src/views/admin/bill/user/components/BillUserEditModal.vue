<template>
  <a-modal
    :title="formModel.id ? '编辑用户' : '创建用户'"
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
      <a-form-item field="nickname" label="昵称">
        <a-input v-model="formModel.nickname" placeholder="请输入昵称..." allowClear />
      </a-form-item>

      <a-form-item field="email" label="邮箱">
        <a-input v-model="formModel.email" placeholder="请输入邮箱..." allowClear />
      </a-form-item>

      <a-form-item field="phone" label="手机">
        <a-input v-model="formModel.phone" placeholder="请输入手机..." allowClear />
      </a-form-item>

      <a-form-item field="gender" label="性别">
        <a-radio-group type="button" v-model="formModel.gender">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
          <a-radio :value="3">保密</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="avatar" label="头像">
        <base-input-upload
          v-model:url="formModel.avatar"
          placeholder="请输入图片url或上传"
          allowClear
        />
      </a-form-item>

      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="formModel.description"
          :max-length="128"
          show-word-limit
          placeholder="请输入个性描述"
          allow-clear
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
const formModel = defineModel<Partial<Type.BillUser>>('form', { default: {} })
const visible = defineModel<boolean>('visible')
const emits = defineEmits(['refresh'])

const rules = computed(() => {
  return {
    account: [
      {
        required: true,
        message: '账号不能为空!'
      },
      {
        message: '账号只能为数字字母下划线组合!',
        validator: (value: string | undefined, cb: (error?: string) => void) => {
          if (!Helper.valid.alphaDash(value || '')) {
            cb('账号只能为数字字母下划线组合!')
          }
        }
      }
    ],
    nickname: [
      {
        required: true,
        message: '昵称不能为空!'
      }
    ],
    email: [
      {
        message: '邮箱格式不正确!',
        validator: (value: string | undefined, cb: (error?: string) => void) => {
          if (!value) return true
          if (!Helper.valid.email(value || '')) {
            cb('邮箱格式不正确!')
          }
        }
      }
    ],
    phone: [
      {
        validator: (value: string | undefined, cb: (error?: string) => void) => {
          if (!value) return true
          if (!Helper.valid.phone(value || '')) {
            cb('手机格式不正确!')
          }
        }
      }
    ]
  }
})

const methods = {
  handleSubmit: () => {
    formRef.value?.validate(async (valid: boolean) => {
      if (valid) return
      methods.handleEdit()
    })
  },

  handleEdit: async () => {
    loading.value = true
    const { code, msg } = await useBillUserApi.update(formModel.value)
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
