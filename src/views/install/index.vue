<template>
  <div class="install-page flex-center">
    <a-card class="install-card-wrap z-1" :bordered="false">
      <template #title>
        <div class="flex-yc g-10">
          <img :src="systemStore.logo" class="install-logo" />
          <h4>系统安装引导</h4>
        </div>
      </template>
      <template #extra>
        <ThemeBtn />
      </template>
      <div class="flex-center">
        <a-steps class="step-wrap mt-40" label-placement="vertical" changeable :current="current">
          <a-step description="数据库初始化">
            <template #icon> <database-config theme="filled" size="14" /> </template
          ></a-step>
          <a-step description="管理员账户">
            <template #icon> <add-user theme="filled" size="14" /> </template>
          </a-step>
          <a-step description="完成安装">
            <template #icon> <check theme="filled" size="14" /> </template>
          </a-step>
        </a-steps>
      </div>

      <div class="form-wrap px-20 mb-20">
        <InitDb ref="initDbRef" class="mt-40" @next="current = 2" v-show="current === 1" />
        <CreateAdmin
          ref="createAdminRef"
          class="mt-40"
          @next="current = 3"
          v-show="current === 2"
        />
        <InstallSuccess class="my-20" v-if="current === 3" />
      </div>

      <div class="flex-center mb-20" v-if="current !== 3">
        <a-space :size="60">
          <a-button type="secondary" :disabled="current <= 1 || loading" @click="methods.onPrev">
            <IconLeft /> 上一步
          </a-button>
          <a-button
            type="primary"
            :loading="loading"
            :disabled="current >= 3"
            @click="methods.onNext"
          >
            下一步 <IconRight />
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import ThemeBtn from '@/components/comm/ThemeBtn.vue'
import { DatabaseConfig, AddUser, Check } from '@icon-park/vue-next'

const current = ref(1)
const initDbRef = ref()
const createAdminRef = ref()
const loading = ref(false)
const systemStore = useSystemStore()

const methods = {
  onPrev: () => {
    current.value = Math.max(1, current.value - 1)
  },

  async onNext() {
    loading.value = true

    switch (current.value) {
      case 1:
        await initDbRef.value?.handleSubmit()
        break
      case 2:
        await createAdminRef.value?.handleSubmit()
        break
    }
    loading.value = false
  }
}
</script>

<style lang="scss">
.install-page {
  width: 100vw;
  height: 100vh;

  .step-wrap {
    max-width: 500px;
  }

  .install-card-wrap {
    width: 500px;
    max-width: 95%;
  }

  .install-logo {
    height: 25px;
  }

  .arco-steps-item-title {
    display: none;
  }

  .arco-steps-item-description {
    margin-top: 10px;
  }

  @include useTheme {
    background: getVal(bgColor);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(119, 128, 250, 0.8), rgba(210, 215, 253, 0.8));
    clip-path: circle(30% at right 70%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(101, 111, 250, 0.8), rgba(166, 173, 252, 0.8));
    clip-path: circle(20% at 10% 10%);
  }
}
</style>
