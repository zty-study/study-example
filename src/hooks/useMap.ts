import * as Cesium from 'cesium'

const point = ref<{ lon: number; lat: number; alt: number }>({ lon: 0, lat: 0, alt: 0 })
const camera = ref<{ heading: number; pitch: number; roll: number }>({
  heading: 0,
  pitch: -90,
  roll: 0
})

export const useMap = () => {
  let handler: Cesium.ScreenSpaceEventHandler

  const addEvent = (viewer: Cesium.Viewer) => {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    // 注册相机变化事件
    viewer.camera.changed.addEventListener(() => {
      camera.value = {
        heading: Cesium.Math.toDegrees(viewer.camera.heading),
        pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
        roll: Cesium.Math.toDegrees(viewer.camera.roll)
      }
    })

    // 注册鼠标移动事件
    handler.setInputAction(({ endPosition }: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      const cartesian = viewer.camera.pickEllipsoid(endPosition)

      if(cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

        point.value.lon = Cesium.Math.toDegrees(cartographic.longitude)
        point.value.lat = Cesium.Math.toDegrees(cartographic.latitude)
        point.value.alt = cartographic.height
      }
 
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  onMounted(() => {
    handler?.destroy()
  })

  return { point, camera, addEvent }
}
