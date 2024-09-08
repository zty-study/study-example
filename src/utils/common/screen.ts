// @ts-nocheck

// 进入全屏
export function enterFullscreen() {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

// 检查是否处于全屏状态
export function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

/**
 * 切换全屏状态
 */
export const toggleFullscreen = () => {
  if (isFullscreen()) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

export const toggleElementFullScreen = (el: string) => {
  const fullscreenElement = document.querySelector(el)
  // const fullscreenElement = el
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen()
    } else if (fullscreenElement.mozRequestFullScreen) {
      fullscreenElement.mozRequestFullScreen()
    } else if (fullscreenElement.webkitRequestFullscreen) {
      fullscreenElement.webkitRequestFullscreen()
    } else if (fullscreenElement.msRequestFullscreen) {
      fullscreenElement.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}
