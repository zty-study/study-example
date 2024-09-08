<template>
  <div class="flex-center theme-btn br-50 pointer theme-hover text-color" @click="handleChange">
    <IconFont v-if="!isDark" name="moon-clear-fill" />
    <IconFont v-else name="sun-fill" />
  </div>
</template>

<script setup lang="ts">
import { SunOne, Moon } from '@icon-park/vue-next'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})

// const configStore = useConfigStore()

const handleChange = async (event: MouseEvent) => {
  // try {
  //   const x = event.clientX
  //   const y = event.clientY
  //   const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  //   let dark: boolean

  //   // @ts-ignore
  //   const transition = document.startViewTransition(() => {
  //     const root = document.documentElement
  //     dark = root.classList.contains('dark')
  //     root.classList.add(dark ? 'light' : 'dark')
  //     root.classList.remove(dark ? 'dark' : 'light')
  //   })

  //   transition.ready.then(() => {
  //     const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
  //     document.documentElement.animate(
  //       {
  //         clipPath: dark ? [...clipPath].reverse() : clipPath
  //       },
  //       {
  //         duration: 500,
  //         easing: 'ease-in',
  //         pseudoElement: dark ? '::view-transition-old(root)' : '::view-transition-new(root)'
  //       }
  //     )
  //   })

  //   await transition.finished
  //   isDark.value = !isDark.value
  // } catch {
  //   isDark.value = !isDark.value
  // }
  isDark.value = !isDark.value
}

watchEffect(() => {
  if (isDark.value) {
    document.body.setAttribute('arco-theme', 'dark')
  } else {
    document.body.removeAttribute('arco-theme')
  }
  //   configStore.setColorTheme(isDark.value)
})
</script>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
.dark::view-transition-old(root) {
  z-index: 1;
}
.dark::view-transition-new(root) {
  z-index: 9;
}

::view-transition-old(root) {
  z-index: 9;
}
::view-transition-new(root) {
  z-index: 1;
}
.theme-btn {
  height: 28px;
  width: 28px;
  @include useTheme {
    background-color: rgba(getVal(mutedColor), 0.1);
  }
}
</style>
