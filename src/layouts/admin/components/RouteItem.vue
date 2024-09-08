<template>
  <template v-for="route in routeList" :key="route.name">
    <a-sub-menu v-if="route.children?.length" :key="route.name">
      <template #icon v-if="appStore.isMobile">
        <IconFont :name="String(route.meta?.icon)" />
      </template>
      <template #title>
        <div class="flex-yc g-5">
          <IconFont v-if="!appStore.isMobile" :name="String(route.meta?.icon)" />
          {{ route.meta?.title }}
        </div>
      </template>
      <RouteItem :route-list="route.children" />
    </a-sub-menu>
    <template v-else>
      <a-menu-item :key="route.name">
        <div v-ripple="{ color: '#fff' }" class="flex-yc px-12 g-5">
          <IconFont v-if="!appStore.isMobile" :name="String(route.meta?.icon)" />
          {{ route.meta?.title }}
        </div>
        <template #icon v-if="appStore.isMobile">
          <IconFont :name="String(route.meta?.icon)" />
        </template>
      </a-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
const appStore = useAppStore()
defineProps<{
  routeList: RouteRecordRaw[]
}>()
</script>

<style lang="scss" scoped>
.arco-menu-item,
.arco-menu-inline-header {
  @include useTheme {
    background-color: rgba(getVal(keyColor), 0.03);
  }
}
</style>
