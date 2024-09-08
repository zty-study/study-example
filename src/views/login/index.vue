<template>
  <div class="login-page-wrap p-40 br-5 z-1 no-select relative">
    <div class="flex-center mt-10">
      <div class="flex-yc g-10">
        <img :src="systemStore.logo" class="login-logo" />
        <h2 class="login-title title-color fs-28 mr-10">登录</h2>
      </div>
    </div>

    <a-form class="mt-40" ref="formRef" :model="formModel" :rules="rules" autocomplete="off">
      <a-form-item field="account" hide-label validate-trigger="blur">
        <a-input v-model="formModel.account" placeholder="请输入账号或邮箱" allow-clear>
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" hide-label validate-trigger="blur">
        <a-input-password
          autocomplete="false"
          v-model="formModel.password"
          placeholder="请输入密码"
          allow-clear
          @keyup.enter="methods.handleLogin"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
    </a-form>

    <a-button :loading="loading" @click="methods.handleLogin" class="w-100 mt-15" type="primary"
      >登 录</a-button
    >

    <ThemeBtn class="theme-btn absolute" />
  </div>
</template>

<script setup lang="ts">
const formRef = ref()
const loading = ref(false)
const formModel = ref({
  account: undefined,
  password: undefined
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const systemStore = useSystemStore()

const rules = {
  account: [
    {
      required: true,
      message: '账号或邮箱不能为空'
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
  handleLogin: () => {
    formRef.value?.validate(async (valid: any) => {
      if (!valid) {
        const { code, data, msg } = await useUserApi.login(formModel.value)
        if (code === 200) {
          userStore.setUserInfo(data)
          ResMsg(code, msg)

          if (route.query.redirect) {
            router.replace({ path: decodeURIComponent(route.query.redirect as string) })
          } else {
            router.replace({ name: 'Home' })
          }
        }
      }
    })
  }
}
</script>

<style lang="scss">
.login-page-wrap {
  width: 90%;
  max-width: 400px;
  @include useTheme {
    background-color: getVal(pureColor);
  }

  .login-logo {
    width: 36px;
  }

  .login-title {
    letter-spacing: 5px;
  }

  .theme-btn {
    top: 20px;
    right: 20px;
  }
}
</style>
