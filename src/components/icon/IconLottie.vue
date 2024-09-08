<script setup lang="ts">
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'
import type { RendererType } from 'lottie-web'

export interface Props {
  name: string
  auto?: boolean
  loop?: boolean
  renderer?: RendererType
  width?: string | number
  height?: string | number
  data?: any
}

const lottieRef = ref()
const props = withDefaults(defineProps<Props>(), {
  name: '',
  auto: true,
  loop: true,
  renderer: 'svg',
  width: '20px',
  height: '20px',
  data: {}
})

const jsonData = ref<any>(null)
const lottieData = ref<AnimationItem>()

const methods = {
  fetchData: async () => {
    const data = await fetch(`/static/lottie/${props.name}.json`)
    if (data.status) {
      jsonData.value = await data.json()
    }
  },
  init: () => {
    // const { data } = await useAsyncData('item', () => $fetch(`/static/lottie/${props.name}.json`))
    if (jsonData.value) {
      lottieData.value = lottie.loadAnimation({
        container: lottieRef.value,
        autoplay: props.auto,
        loop: props.loop,
        renderer: props.renderer,
        animationData: jsonData.value
      })
      lottieData.value.play()
    }
  }
}

onMounted(async () => {
  await methods.fetchData()
  methods.init()
})

nextTick(() => {
  methods.init()
  // lottieData.value && lottieData.value.play();
})
</script>

<template>
  <div class="lottie-wrapper">
    <span class="disib" ref="lottieRef"></span>
  </div>
</template>

<style lang="scss" scoped>
.lottie-wrapper {
  width: v-bind('props.width');
  height: v-bind('props.height');
}
</style>
