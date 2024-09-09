import * as Cesium from 'cesium'

const drawType = ref() // 绘制类型

let _entityConfig: any = {} // 绘制配置
let _currentEntity: Cesium.Entity | undefined // 当前绘制实体
let _mousePos: Cesium.Cartesian3 | undefined // 移动点
let _tempPositions: Cesium.Cartesian3[] = [] // 存储点集合
let _dataSource: Cesium.CustomDataSource | undefined // 资源集合
let _drawHandler: Cesium.ScreenSpaceEventHandler // 事件

export const drawMap = () => {
  // Cesium参数转换
  const _drawConfig = computed(() => {
    return {
      ...(_entityConfig || {}),
      color: _entityConfig?.color
        ? Cesium.Color.fromCssColorString(_entityConfig.color)
        : Cesium.Color.WHITE,
      outlineColor: _entityConfig?.outlineColor
        ? Cesium.Color.fromCssColorString(_entityConfig.outlineColor)
        : Cesium.Color.WHITE
    }
  })

  // 激活绘制目标
  const activated = (target: string, config?: any) => {
    drawType.value = drawType.value === target ? undefined : target
    _entityConfig = drawType.value ? config || {} : undefined
  }

  // 画点
  const _drawPoint = (pos: Cesium.Cartesian3) => {
    _dataSource?.entities.add({
      id: 'point-' + Math.random().toString(36).substring(2),
      position: pos,
      point: Object.assign(
        {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
        },
        _drawConfig.value || {}
      )
    })
  }

  // 画线
  const _drawLine = (position?: Cesium.Cartesian3[]) => {
    // _currentEntity && _tempPositions?.length && _dataSource?.entities.remove(_currentEntity)
    _dataSource?.entities.add({
      id: 'line-' + Math.random().toString(36).substring(2),
      polyline: Object.assign(
        {
          positions: new Cesium.CallbackProperty(() => {
            const c = Array.from(position || _tempPositions)
            _mousePos && !position && c.push(_mousePos)
            return c
          }, false),
          width: 2,
          material: Cesium.Color.RED
        },
        _drawConfig.value || {}
      )
    })
  }

  const handleDraw = (viewer: Cesium.Viewer) => {
    if (!viewer) return
    _drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    _dataSource = new Cesium.CustomDataSource('_dataSource')
    viewer.dataSources.add(_dataSource)

    // 左键单击事件处理
    _drawHandler.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      let pos: Cesium.Cartesian3 | undefined
      const ray = viewer.camera.getPickRay(position)
      ray && (pos = viewer.scene.globe.pick(ray, viewer.scene))
      switch (drawType.value) {
        case 'point':
          pos && _drawPoint(pos)
          break
        case 'line':
          pos && _tempPositions.push(pos)
          _tempPositions?.length > 0 && _drawLine()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 右键键单击事件处理
    _drawHandler.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      switch (drawType.value) {
        case 'line':
          _drawLine(_tempPositions)
          _tempPositions = []
          break
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // 注册鼠标移动事件
    _drawHandler.setInputAction(({ endPosition }: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      if (_tempPositions?.length > 0) {
        const p = viewer.scene.pickPosition(endPosition)
        if (!p) return
        _mousePos = p
      } else {
        _mousePos = undefined
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  // 清除
  const clear = () => {
    _dataSource?.entities.removeAll()

    _mousePos = undefined
    _tempPositions = []
  }

  onUnmounted(() => {
    clear()

    _dataSource && window.viewer?.dataSources.remove(_dataSource)
    _dataSource = undefined
    _drawHandler?.destroy()
  })

  return { drawType, activated, handleDraw, clear }
}
