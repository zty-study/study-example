<template>
  <a-layout class="layout-admin-container">
    <a-layout-sider :collapsed="appStore.isMobile"><AdminSide breakpoint="lg" /></a-layout-sider>
    <a-layout class="h-100 flex-column">
      <a-layout-header><AdminHeader /></a-layout-header>
      <a-layout-content class="flex-column p-15 flex-1 h-0">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <KeepAlive v-if="!route.meta.noKeepAlive">
              <component :is="Component" :key="route.path"></component>
            </KeepAlive>
            <component v-else :is="Component" :key="route.path"></component>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import useResponsive from '@/hooks/responsive'

const route = useRoute()

useResponsive(true)

const appStore = useAppStore()
</script>

<style lang="scss">
.layout-admin-container {
  height: 100vh;
  color: var(--text-color);

  .arco-layout-content {
    overflow-y: auto;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .base-table-card-wrap {
    display: flex;
    overflow: hidden;
    flex-direction: column;

    thead {
      user-select: none;
    }

    .arco-card-header {
      flex-shrink: 0;
    }
    .arco-card-body {
      flex: 1;
      height: 0;
      .arco-table {
        flex: 1;
        height: 0 !important;
      }

      .arco-table-container {
        .arco-scrollbar-thumb-bar,
        .arco-scrollbar-track {
          display: none !important;
        }
      }
    }
  }

  .arco-pagination-item {
    color: var(--color-text-2);
    background-color: var(--color-fill-2);
    border-color: transparent;

    &:hover {
      color: rgb(var(--primary-6));
      background-color: var(--color-primary-light-1);
    }

    &.arco-pagination-item-active {
      color: #fff;
      background-color: var(--theme-color);
    }

    &.arco-pagination-item-disabled {
      &:hover {
        color: var(--color-text-4);
        background-color: transparent;
        border-color: transparent;
      }
    }
  }

  @include useTheme {
    background-color: getVal(bgColor);
  }

  .arco-layout-header {
    @include useTheme {
      border-bottom: 1px solid getVal(borderColor);
      background-color: getVal(pureColor);
    }
  }

  .arco-layout-sider {
    @include useTheme {
      border-right: 1px solid getVal(borderColor);
      background-color: getVal(pureColor);
    }
  }
}
</style>
