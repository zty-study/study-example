<template>
  <div class="cesium-entity-page wh-100 card-bg br-5">
    <div id="map-entity" class="wh-100"></div>
    <div v-if="ready" class="map-tool-wrap wh-100 relative z-3">
      <MapToolBar class="map-tool-bar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'

const { createMap } = initMap()
const { addEvent } = useMap()
const ready = ref(false)

onMounted(async () => {
  const viewer = createMap('map-entity')
  viewer.camera.setView({
    // destination: Cesium.Cartesian3.fromDegrees(105.30028908169245, 26.96206735504125, 4000),
    destination: new Cesium.Cartesian3(-1506336.0270883515, 5487916.296421073, 2876393.963906946),
    orientation: {
      heading: 4.417425186487677,
      pitch: -0.3107427037808055,
      roll: 6.283161438815717
    }
  })

  //   viewer.scene.primitives.add(await Cesium.createOsmBuildingsAsync())

  addEvent(viewer)
  ready.value = true
})

onBeforeMount(() => {
  ready.value = false
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
#map-entity {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
}
.cesium-entity-page {
  // position: relative;
  .map-tool-wrap {
    pointer-events: none;
    .map-tool-bar {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
