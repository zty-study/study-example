<template>
  <div class="login-layout-main flex-center">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <KeepAlive v-if="!route.meta.noKeepAlive">
          <component :is="Component" :key="route.path"></component>
        </KeepAlive>
        <component v-else :is="Component" :key="route.path"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
.login-layout-main {
  height: 100vh;
  @include useTheme {
    background-color: getVal(bgColor);
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
