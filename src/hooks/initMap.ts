import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'

declare global {
  interface Window {
    viewer: Cesium.Viewer
  }
}

const token = '1b7e6d0d69b7c4ac48e13111aa6dbf81'
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

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
      sceneMode: Cesium.SceneMode.SCENE2D
    })

    // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    // scene.screenSpaceCameraController.enableRotate = false;
    // // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    // scene.screenSpaceCameraController.enableTranslate = false;
    // // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    // scene.screenSpaceCameraController.enableZoom = false;
    // // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    // viewer.scene.screenSpaceCameraController.enableTilt = false

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

    // 叠加国界服务天地图
    // const iboMap = new Cesium.UrlTemplateImageryProvider({
    //   url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    //   subdomains: subdomains,
    //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
    //   maximumLevel: 10
    // })
    // viewer.imageryLayers.addImageryProvider(iboMap)

    // 矢量底图
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider({
    //     url:
    //     tdtUrl + 'vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
    //       token,
    //     layer: 'tdtVecBasicLayer',
    //     style: 'default',
    //     format: 'image/jpeg',
    //     tileMatrixSetID: 'GoogleMapsCompatible'
    //   })
    // )

    // 影像底图
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider({
    //     url:
    //       'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
    //       token,
    //     layer: 'tdtVecBasicLayer',
    //     style: 'default',
    //     format: 'image/jpeg',
    //     tileMatrixSetID: 'GoogleMapsCompatible'
    //   })
    // )

    // 矢量注记
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider({
    //     url:
    //       'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
    //       token,
    //     layer: 'tdtAnnoLayer',
    //     style: 'default',
    //     format: 'image/jpeg',
    //     tileMatrixSetID: 'GoogleMapsCompatible'
    //   })
    // )

    // 影像注记
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider({
    //     url:
    //       'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' +
    //       token,
    //     layer: 'tdtAnnoLayer',
    //     style: 'default',
    //     format: 'image/jpeg',
    //     tileMatrixSetID: 'GoogleMapsCompatible'
    //   })
    // )

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
    // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000
    // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200

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
