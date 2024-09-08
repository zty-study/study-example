<template>
  <a-result status="success" title="安装成功！">
    <template #subtitle> 恭喜你，系统安装成功! </template>
    <template #extra>
      <a-button class="mt-20" type="primary" @click="router.push({ name: 'Home' })"
        >点击开始</a-button
      >
    </template>
  </a-result>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style lang="scss" scoped></style>
