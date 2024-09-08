<template>
  <img
    :src="`/static/icon/png/${name}.png`"
    background="trnsparent"
    :style="{ height: `${size}px`, width: `${size}px` }"
  />
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: [Number, String],
    default: 16
  }
})
</script>

<style lang="scss" scoped></style>
