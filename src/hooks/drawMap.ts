import * as Cesium from 'cesium'
import { getSpaceDistance } from '@/utils/cesium/tools/distance'
import { getPositionDistance } from '@/utils/cesium/tools/distance'
import startImg from '@/assets/images/start.svg'
import endImg from '@/assets/images/end.svg'

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
  const drawLine = (position?: Cesium.Cartesian3[]) => {
    _dataSource?.entities.add({
      id: 'line-' + Math.random().toString(36).substring(2),
      polyline: Object.assign(
        // corridor: Object.assign(
        {
          positions: new Cesium.CallbackProperty(() => {
            const c = Array.from(position || _tempPositions)
            _mousePos && !position && c.push(_mousePos)
            return c
          }, false),
          width: 2,
          material: Cesium.Color.RED,
          arcType: Cesium.ArcType.NONE
        },
        _drawConfig.value || {}
      )
    })
  }

  // 测距
  const drawDistance = (position?: Cesium.Cartesian3[]) => {
    // 起点广告牌
    if (position?.length === 1 || _tempPositions.length === 1) {
      _dataSource?.entities.add({
        position: position?.[0] || _tempPositions[0],
        billboard: {
          image: startImg,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          height: 30,
          width: 30
        }
      })
    }
    // 终点广告牌
    if (position && position.length >= 2) {
      _dataSource?.entities.add({
        position: position[position.length - 1],
        billboard: {
          image: endImg,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          height: 30,
          width: 30
        }
      })
    }

    // 节点point
    if (!position && _tempPositions.length >= 1) {
      _dataSource?.entities.add({
        position: _tempPositions[_tempPositions.length - 1],
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
        }
      })
    }

    if (_tempPositions.length > 1 && !position) {
      const distance = getPositionDistance(_tempPositions)
      const distanceKm = (Number(distance) / 1000).toFixed(3)
      const title = Number(distanceKm) > 1 ? `${distanceKm} 公里` : `${distance} 米`
      _dataSource?.entities.add({
        id: 'distance-' + Math.random().toString(36).substring(2),
        label: {
          text: title,
          font: '12px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          showBackground: true,
          backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.5), // 半透明背景
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 10)
        },
        position: _mousePos
      })
    }

    _dataSource?.entities.add({
      id: 'line-' + Math.random().toString(36).substring(2),
      polyline: Object.assign(
        // corridor: Object.assign(
        {
          positions: new Cesium.CallbackProperty(() => {
            const c = Array.from(position || _tempPositions)
            _mousePos && !position && c.push(_mousePos)
            return c
          }, false),
          width: 2,
          material: Cesium.Color.YELLOW,
          arcType: Cesium.ArcType.NONE
        },
        _drawConfig.value || {}
      )
    })
  }

  // 画扇形
  const drawSector = (
    position: Cesium.Cartesian3,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const postions: Cesium.Cartesian3[] = []
    const startAng = Cesium.Math.toRadians((endAngle < startAngle ? 90 : 450) - endAngle)
    const endAng = Cesium.Math.toRadians(450 - startAngle)

    // 绘制扇形边缘折线
    const mtx = Cesium.Transforms.eastNorthUpToFixedFrame(position)

    for (let angle = startAng; angle <= endAng; angle += 0.05) {
      const point = new Cesium.Cartesian3(radius * Math.cos(angle), radius * Math.sin(angle), 0)
      Cesium.Matrix4.multiplyByPoint(mtx, point, point)
      postions.push(point)
    }
    // const startPoint = new Cesium.Cartesian3(
    //   radius * Math.cos(startAng),
    //   radius * Math.sin(startAng),
    //   0
    // )
    // const endPoint = new Cesium.Cartesian3(radius * Math.cos(endAng), radius * Math.sin(endAng), 0)

    // Cesium.Matrix4.multiplyByPoint(mtx, startPoint, startPoint)
    // Cesium.Matrix4.multiplyByPoint(mtx, endPoint, endPoint)

    _dataSource?.entities.add({
      position: position,
      // ellipsoid: {
      //   radii: new Cesium.Cartesian3(radius, radius, 0.1),
      //   minimumClock: startAng,
      //   maximumClock: endAng,
      //   material: Cesium.Color.DARKCYAN.withAlpha(0.5),
      //   outlineColor: Cesium.Color.RED,
      //   outlineWidth: 20
      // },
      polygon: {
        hierarchy: [position, ...postions],
        material: Cesium.Color.DARKCYAN.withAlpha(0.8),
        outline: false,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        arcType: Cesium.ArcType.RHUMB
      },
      polyline: {
        positions: [postions[0], position, postions[postions.length - 1]],
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.DARKCYAN,
          dashLength: 20
        }),
        arcType: Cesium.ArcType.NONE
      }
    })
  }

  const handleDraw = () => {
    // 左键单击事件处理
    _drawHandler.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      console.log('position', position)
      // let pos: Cesium.Cartesian3 | undefined
      // const ray = viewer.camera.getPickRay(position)
      // ray && (pos = viewer.scene.globe.pick(ray, viewer.scene))

      const pos = viewer.scene.pickPosition(position)
      switch (drawType.value) {
        case 'point':
          pos && _drawPoint(pos)
          break
        case 'line':
          pos && _tempPositions.push(pos)
          _tempPositions?.length > 0 && drawLine()
          break
        case 'distance':
          pos && _tempPositions.push(pos)
          _tempPositions?.length > 0 && drawDistance()
          break
        case 'sector':
          console.log(pos)
          pos && drawSector(pos, viewer.camera.position.z / 10, 20, 110)
          break
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 右键键单击事件处理
    _drawHandler.setInputAction(({ position }: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      switch (drawType.value) {
        case 'line':
          drawLine(_tempPositions)
          _tempPositions = []
          break
        case 'distance':
          drawDistance(_tempPositions)
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
