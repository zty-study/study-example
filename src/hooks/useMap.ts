import * as Cesium from 'cesium'
import { screenToGeographic } from '@/utils/cesium/tools'
import Point from '@/utils/cesium/entity/point'

let _handler: Cesium.ScreenSpaceEventHandler | undefined

export const useMap = (viewer: Cesium.Viewer) => {
  if (!_handler) {
    _handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 事件处理对象
  }

  const cartesian = ref<Cesium.Cartesian3>() // 笛卡尔坐标
  const geographic = ref<Type.Geographic>({ lon: 0, lat: 0, alt: 0 })
  const drawType = ref<Type.DrawType>() // 绘制类型
  const camera = ref<{ heading?: number; pitch?: number; roll?: number }>({}) // 相机参数

  const _drawConfig = ref<Record<string, any>>({}) // 绘制配置
  const _dataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource('_dataSource') // 资源集合
  let _mousePos: Cesium.Cartesian3 | undefined // 移动点
  let _tempPositions: Cesium.Cartesian3[] = [] // 存储点集合

  const point = new Point(_dataSource.entities)

  viewer.dataSources.add(_dataSource)

  // 相机变化事件
  viewer.camera.changed.addEventListener(() => {
    camera.value = {
      heading: Cesium.Math.toDegrees(viewer.camera.heading),
      pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
      roll: Cesium.Math.toDegrees(viewer.camera.roll)
    }
  })

  // 鼠标移动事件
  _handler?.setInputAction(({ endPosition }: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
    geographic.value = screenToGeographic(viewer, endPosition)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  // 鼠标左键点击事件
  _handler?.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
    // console.log((geographic.value = screenToGeographic(viewer, position)))
    const pos = viewer.scene.pickPosition(position)

    const pointPrimitiveCollection = new Cesium.PointPrimitiveCollection()
    for (let i = 0; i < 200000; i++) {
      const opts = {
        position: Cesium.Cartesian3.fromDegrees(
          116.39 + Math.random() * 50,
          39.9 + Math.random() * 50
        ),
        color: Cesium.Color.GREEN,
        pixelSize: 10
      }
      pointPrimitiveCollection.add(opts)
    }
    viewer.scene.primitives.add(pointPrimitiveCollection)

    // switch (drawType.value) {
    //   case 'point':
    //     pos && point.draw(pos, _drawConfig.value)
    //     break
    // }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  // 激活绘制目标
  const activated = (target: Type.DrawType, config?: any) => {
    drawType.value = drawType.value === target ? undefined : target
    _drawConfig.value = config || {}
  }

  // 清除
  const clear = () => {
    _dataSource?.entities.removeAll()
    _mousePos = undefined
    _tempPositions = []
  }

  onBeforeUnmount(() => {
    clear()
    _dataSource && window.viewer?.dataSources?.remove(_dataSource)
    // _handler?.destroy()
  })

  return {
    camera,
    drawType,
    cartesian,
    geographic,
    activated,
    clear
  }
}
