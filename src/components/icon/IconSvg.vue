<template>
  <img
    :src="`/static/icon/svg/${name}.svg`"
    background="trnsparent"
    :style="{ height: `${size}px`, width: `${size}px` }"
  />
</template>

<script setup lang="ts">
defineProps(['name', 'size'])
</script>
