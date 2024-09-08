<template>
  <a-form
    class="init-db-step"
    ref="formRef"
    :model="formModel"
    :rules="rules"
    layout="vertical"
    autocomplete="off"
  >
    <a-space direction="vertical">
      <a-form-item field="host" hide-label validate-trigger="blur">
        <template #extra> 数据库地址 </template>
        <a-input v-model="formModel.host" placeholder="请输入数据库地址" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="port" hide-label validate-trigger="blur">
        <template #extra> 数据库端口 </template>
        <a-input-number v-model="formModel.port" placeholder="请输入数据库端口" allow-clear>
        </a-input-number>
      </a-form-item>
      <a-form-item field="database" hide-label validate-trigger="blur">
        <template #extra> 数据库名称 </template>
        <a-input v-model="formModel.database" placeholder="请输入数据库名" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="username" hide-label validate-trigger="blur">
        <template #extra> 数据库用户名 </template>
        <a-input v-model="formModel.username" placeholder="请输入用户名" allow-clear> </a-input>
      </a-form-item>
      <a-form-item field="password" hide-label validate-trigger="blur">
        <template #extra> 数据库密码 </template>
        <a-input-password
          autocomplete="false"
          v-model="formModel.password"
          placeholder="请输入密码"
          allow-clear
        >
        </a-input-password>
      </a-form-item>

      <a-form-item field="prefix" hide-label validate-trigger="blur">
        <template #extra> 数据表前缀 </template>
        <a-input v-model="formModel.prefix" placeholder="请输入数据表前缀" allow-clear> </a-input>
      </a-form-item>
    </a-space>
  </a-form>
</template>

<script setup lang="ts">
const formRef = ref()
const formModel = reactive({
  host: 'localhost',
  port: 3306,
  database: undefined,
  username: 'root',
  password: undefined,
  prefix: undefined
})
const emits = defineEmits(['next'])
const rules = {
  host: [
    {
      required: true,
      message: '请输入数据库地址'
    }
  ],
  port: [
    {
      required: true,
      message: '请输入正确的端口号'
    }
  ],
  database: [
    {
      required: true,
      message: '数据库名不能为空'
    }
  ],
  username: [
    {
      required: true,
      message: '用户名不能为空'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空'
    }
  ]
}

const methods = {
  handleSubmit: async () => {
    const valid = await formRef.value?.validate()
    if (!valid) {
      await useInstallApi.remove()
      const { code } = await useInstallApi.connect(formModel)
      if (code !== 200) return

      const res = await useInstallApi.init()
      ResMsg(res.code, res.msg)
      if (res.code === 200) emits('next')
    }
  }
}

defineExpose({
  handleSubmit: methods.handleSubmit
})
</script>

<style lang="scss" scoped></style>
