import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'

declare global {
  interface Window {
    viewer: Cesium.Viewer
  }
}

export const initMap = () => {
  const createMap = (id: string) => {
    const viewer = new Cesium.Viewer(id, {
      infoBox: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      // animation: false,
      timeline: false,
      fullscreenButton: false,
      selectionIndicator: false, // 取消绿色选框
      vrButton: false,
      sceneMode: Cesium.SceneMode.SCENE3D
    })

    // 抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = false
    // 水雾特效
    viewer.scene.globe.showGroundAtmosphere = true
    // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
    // viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5
    // viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    //   Cesium.CameraEventType.RIGHT_DRAG,
    //   Cesium.CameraEventType.WHEEL,
    //   Cesium.CameraEventType.PINCH
    // ]
    // viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    //   Cesium.CameraEventType.MIDDLE_DRAG,
    //   Cesium.CameraEventType.PINCH,
    //   {
    //     eventType: Cesium.CameraEventType.LEFT_DRAG,
    //     modifier: Cesium.KeyboardEventModifier.CTRL
    //   },
    //   {
    //     eventType: Cesium.CameraEventType.RIGHT_DRAG,
    //     modifier: Cesium.KeyboardEventModifier.CTRL
    //   }
    // ]

    viewer.resolutionScale = window.devicePixelRatio

    // 取消默认的双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true
    }).then((terrainProvider) => {
      viewer.terrainProvider = terrainProvider
    })

    // 开启地形检测
    // viewer.scene.globe.depthTestAgainstTerrain = true

    // 设置地图缩放高度范围
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200

    window.viewer = viewer
    return viewer
  }

  onUnmounted(() => {
    window.viewer?.destroy()
  })

  return {
    createMap
  }
}
