import * as Cesium from 'cesium'

const point = ref<{ lon: number; lat: number; alt: number }>({ lon: 0, lat: 0, alt: 0 })
const camera = ref<{ heading: number; pitch: number; roll: number }>({
  heading: 0,
  pitch: -90,
  roll: 0
})

let globalHandler: Cesium.ScreenSpaceEventHandler
let drawPointHandler: Cesium.ScreenSpaceEventHandler

export const useMap = () => {
  // 注入默认监听事件
  const addEvent = (viewer: Cesium.Viewer) => {
    globalHandler?.destroy()
    globalHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    // 注册相机变化事件
    viewer.camera.changed.addEventListener(() => {
      camera.value = {
        heading: Cesium.Math.toDegrees(viewer.camera.heading),
        pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
        roll: Cesium.Math.toDegrees(viewer.camera.roll)
      }
    })

    // 注册鼠标移动事件
    globalHandler.setInputAction(({ endPosition }: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      const cartesian = viewer.camera.pickEllipsoid(endPosition)

      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

        point.value.lon = Cesium.Math.toDegrees(cartographic.longitude)
        point.value.lat = Cesium.Math.toDegrees(cartographic.latitude)
        point.value.alt = cartographic.height
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  // 左单击事件
  // const drawPoint = (viewer: Cesium.Viewer, callback: Function) => {
  //   handler?.destroy()
  //   handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  //   handler?.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
  //     callback(event)
  //   }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  // }

  // 画点
  const drawPoint = (config?: Cesium.Entity.ConstructorOptions) => {
    if (!window.viewer) return
    drawPointHandler?.destroy()
    drawPointHandler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)

    drawPointHandler.setInputAction(
      ({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const ray = window.viewer.camera.getPickRay(position)
        const pos = window.viewer.scene.globe.pick(ray!, window.viewer.scene)
        window.viewer.entities.add({
          id: Math.random().toString(36).substring(2),
          position: pos,
          point: Object.assign(
            {
              color: Cesium.Color.RED,
              pixelSize: 10,
              outlineWidth: 2,
              outlineColor: Cesium.Color.WHITE
              // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              // disableDepthTestDistance: 99000000
              // heightReference: Cesium.HeightReference.NONE
            },
            config || {}
          )
        })
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
  }

  onUnmounted(() => {
    // globalHandler?.destroy()
    // drawPointHandler?.destroy()
  })

  return { point, camera, addEvent, drawPoint }
}
