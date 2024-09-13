import * as Cesium from 'cesium'

export const drawMap = (viewer: Cesium.Viewer) => {
  const drawType = ref() // 绘制类型

  let _entityConfig: any = {} // 绘制配置
  let _mousePos: Cesium.Cartesian3 | undefined // 移动点
  let _tempPositions: Cesium.Cartesian3[] = [] // 存储点集合
  const _dataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource('_dataSource') // 资源集合
  const _drawHandler: Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
  ) // 事件

  viewer.dataSources.add(_dataSource)

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

  // 画扇形
  const drawSector = (
    point: Cesium.Cartesian3,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    _dataSource?.entities.add({
      name: 'Wedge',
      position: point,
      ellipsoid: {
        radii: new Cesium.Cartesian3(radius, radius, 1.0),
        minimumClock: Cesium.Math.toRadians((endAngle < startAngle ? 90 : 450) - endAngle),
        maximumClock: Cesium.Math.toRadians(450 - startAngle),
        material: Cesium.Color.DARKCYAN.withAlpha(0.3),
        outlineColor: Cesium.Color.RED,
        outlineWidth: 20
      }
    })
  }

  const handleDraw = () => {
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
          break
        case 'sector':
          pos && drawSector(pos, 400, 20, 10)
          break
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

  onBeforeUnmount(() => {
    clear()

    _dataSource && window.viewer?.dataSources.remove(_dataSource)
    _drawHandler?.destroy()
  })

  return { drawType, activated, handleDraw, clear }
}
