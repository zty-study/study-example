<template>
  <div class="map-base-info px-10 py-5 fs-12">
    <div class="flex-yc flex-sb">
      <div class="flex-yc flex-1">经度：{{ point.lon }}</div>
      <div class="flex-yc flex-1">纬度：{{ point.lat }}</div>
      <div class="flex-yc flex-1">高度：{{ 0 }}</div>
    </div>
    <div class="flex-yc flex-sb mt-5">
      <div class="flex-yc flex-1">heading：{{ camera.heading }}</div>
      <div class="flex-yc flex-1">pitch：{{ camera.pitch }}</div>
      <div class="flex-yc flex-1">roll：{{ camera.roll }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { point, camera } = useMap()
</script>

<style lang="scss" scoped>
.map-base-info {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #fff;
  width: 600px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  border-top-right-radius: 5px;
}
</style>
