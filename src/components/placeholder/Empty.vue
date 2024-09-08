<template>
  <div class="placeholder-emprt-wrapper w-100 center p-2">
    <img :alt="text" class="h-100" src="/static/images/svg/empty.svg" />
    <div class="mt-2 empty-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '这里空空如也...'
})
</script>

<style lang="scss" scoped>
.placeholder-emprt-wrapper {
  img {
    max-height: 200px;
  }
  .empty-text {
    color: #999;
    font-size: 14px;
  }
}
</style>
