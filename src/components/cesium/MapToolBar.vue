<template>
  <div class="map-tool-bar-wrap flex-yc">
    <a-tooltip v-for="(tool, index) in toolList" :key="index" :content="tool.name">
      <div
        class="tool-item pointer"
        :class="{ active: tool.value === currentTool }"
        @click="currentTool = currentTool === tool.value ? undefined : tool.value"
      >
        <IconFont :name="tool.icon" :size="tool.size || 16" color="#fff" />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
const currentTool = ref()
const { drawPoint } = useMap()

const toolList = [
  { name: '画点', value: 'point', icon: 'checkbox-blank-circle-fill', size: 10 },
  { name: '画线', value: 'polygon', icon: 'pencil-line' },
  { name: '广告牌', value: 'billboard', icon: 'map-pin-fill' },
  { name: '测距', value: 'distant', icon: 'ruler-fill' }
]

// const handleToolFunc = () => {
//   switch (currentTool.value) {
//     case 'point':
//       drawPoint()
//       break
//   }
// }

onMounted(() => {
  drawPoint()
})
</script>

<style lang="scss" scoped>
.map-tool-bar-wrap {
  pointer-events: all;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(1px);

  .tool-item {
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }

    &.active {
      background-color: var(--theme-color);
    }
  }
}
</style>
