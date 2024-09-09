import * as Cesium from 'cesium'

const currentDraw = ref()
const entityConfig = ref<any>({})

let handler: Cesium.ScreenSpaceEventHandler

export const drawMap = () => {
  handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)

  // Cesium参数转换
  const _drawConfig = computed(() => {
    return {
      ...(entityConfig.value || {}),
      color: entityConfig.value?.color
        ? Cesium.Color.fromCssColorString(entityConfig.value.color)
        : Cesium.Color.WHITE,
      outlineColor: entityConfig.value?.outlineColor
        ? Cesium.Color.fromCssColorString(entityConfig.value.outlineColor)
        : Cesium.Color.WHITE
    }
  })

  // 激活绘制目标
  const activated = (target: string, config?: any) => {
    currentDraw.value = currentDraw.value === target ? undefined : target
    entityConfig.value = currentDraw.value ? config || {} : undefined
  }

  // 画点
  const _drawPoint = (viewer: Cesium.Viewer, position: Cesium.Cartesian2) => {
    const ray = window.viewer.camera.getPickRay(position)
    const pos = window.viewer.scene.globe.pick(ray!, window.viewer.scene)

    viewer.entities.add({
      id: Math.random().toString(36).substring(2),
      position: pos,
      point: Object.assign(
        {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        _drawConfig.value || {}
      )
    })
  }

  const handleDraw = (viewer: Cesium.Viewer) => {
    if (!viewer) return
    handler.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      switch (currentDraw.value) {
        case 'point':
          _drawPoint(viewer, position)
          break
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // 清除所有实体
  const clear = () => {
    window.viewer.entities.removeAll()
  }

  onUnmounted(() => {
    handler?.destroy()
  })

  return { currentDraw, activated, handleDraw, clear }
}
