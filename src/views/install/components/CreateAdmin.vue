<template>
  <a-form
    class="create-admin-step"
    ref="formRef"
    :model="formModel"
    :rules="rules"
    layout="vertical"
    autocomplete="off"
  >
    <a-space direction="vertical">
      <a-form-item field="account" hide-label validate-trigger="blur">
        <template #extra> 管理员账号 </template>
        <a-input v-model="formModel.account" placeholder="请输入账号" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="nickname" hide-label validate-trigger="blur">
        <template #extra> 管理员昵称 </template>
        <a-input v-model="formModel.nickname" placeholder="请输入昵称" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="email" hide-label validate-trigger="blur">
        <template #extra> 管理员邮箱 </template>
        <a-input v-model="formModel.email" placeholder="请输入邮箱" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="password" hide-label validate-trigger="blur">
        <template #extra> 管理员密码 </template>
        <a-input-password
          autocomplete="false"
          v-model="formModel.password"
          placeholder="请输入密码"
          allow-clear
        >
        </a-input-password>
      </a-form-item>
      <a-form-item field="re_password" hide-label validate-trigger="blur">
        <template #extra> 确认管理员密码 </template>
        <a-input-password
          autocomplete="false"
          v-model="formModel.re_password"
          placeholder="请确认密码"
          allow-clear
        >
        </a-input-password>
      </a-form-item>
    </a-space>
  </a-form>
</template>

<script setup lang="ts">
const formRef = ref()
const formModel = reactive({
  account: undefined,
  nickname: undefined,
  email: undefined,
  password: undefined,
  re_password: undefined
})

const emits = defineEmits(['next'])

const rules = {
  account: [
    {
      required: true,
      message: '请输入管理员账号'
    }
  ],
  nickname: [
    {
      required: true,
      message: '请输入管理员昵称'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入管理员邮箱'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入管理员密码'
    },
    {
      minLength: 8,
      message: '密码长度不能低于8位'
    }
  ],
  re_password: [
    {
      required: true,
      message: '请确认管理员密码'
    },

    {
      required: true,
      validator: (value: string | undefined, cb: (error?: string) => void) => {
        if (value !== formModel.password) {
          cb('密码不一致!')
        }
      }
    }
  ]
}

const methods = {
  handleSubmit: async () => {
    const valid = await formRef.value?.validate()
    if (!valid) {
      const { code, msg } = await useInstallApi.admin(formModel)

      if (code === 200) {
        emits('next')
        ResMsg(code, msg)
      }
    }
  }
}

defineExpose({
  handleSubmit: methods.handleSubmit
})
</script>

<style lang="scss" scoped></style>
