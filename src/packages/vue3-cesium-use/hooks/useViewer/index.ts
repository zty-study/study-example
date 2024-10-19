import type { Viewer } from 'cesium'
import {
  type InjectionKey,
  type ShallowRef,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  unref,
  inject
} from 'vue'

const CESIUM_VIEWER: InjectionKey<ShallowRef<Viewer | undefined>> = Symbol('viewer')

export const provideViewer = (fn: () => Viewer | PromiseLike<Viewer>) => {
  const viewer = shallowRef<Viewer>()
  const isMounted = ref(false)

  provide(CESIUM_VIEWER, viewer)

  onMounted(() => {
    const val = fn()

    if (val instanceof Promise) {
      ;(val as Promise<Viewer>).then((v) => {
        isMounted.value = true
        viewer.value = v as Viewer
      })
    } else {
      isMounted.value = true
      viewer.value = val as Viewer
    }
  })

  onUnmounted(() => {
    viewer.value?.destroy()
  })

  return {
    isMounted,
    viewer
  }
}

export const getViewer = (): Viewer => {
  const viewerInject = unref(inject(CESIUM_VIEWER, undefined))
  if (!viewerInject) {
    throw new Error(
      'Failed to get viewer because viewer is undefined now.Failed to get viewer because viewer is undefined now.'
    )
  }

  return viewerInject
}
