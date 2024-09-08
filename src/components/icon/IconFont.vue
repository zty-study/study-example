<template>
  <i
    :style="{ fontSize: `${size}px`, lineHeight: `${size}px`, height: `${size}px`, color }"
    class="iconfont"
    aria-hidden="true"
    :class="`iconfont-${name}`"
  ></i>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: number | string
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 16
})
</script>
