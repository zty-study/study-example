<template>
<div class="cesium-entity-page wh-100 card-bg br-5">
    <div id="map-entity" class="wh-100"></div>
    <template v-if="ready">
      <MapBaseInfo />
    </template>
</div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'

const { createMap } = initMap()
const { addEvent } = useMap()
const ready = ref(false)

onMounted(async () => {
    const viewer = await createMap("map-entity")
    addEvent(viewer)
    ready.value = true
})
</script>

<style lang="scss">
.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
.cesium-viewer-animationContainer {
    display: none !important;
}
.cesium-entity-page {
    position: relative;
}
</style>