import type { Directive } from 'vue'

const DISTANCE = 50
const DURATION = 500
const map = new WeakMap()

const handleObserve = (el: HTMLElement) => {
  const obServer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const animate = map.get(entry.target)
        if (animate) animate.play()
        obServer.unobserve(el)
      }
    }
  })
  obServer.observe(el)
}

const isBelowViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return rect.top - DISTANCE > window.innerHeight
}

/**
 * 通用型元素平滑上升指令 v-slide-in
 */
const slideIn: Directive = {
  mounted(el: HTMLElement) {
    if (!isBelowViewport(el)) {
      return
    }
    const animation = el.animate(
      [
        { transform: `translateY(${DISTANCE}px)`, opacity: 0.5 },
        { transform: `translateY(0)`, opacity: 1 }
      ],
      {
        duration: DURATION,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    )

    animation.pause()
    map.set(el, animation)
    handleObserve(el)
  }
}

export default slideIn
