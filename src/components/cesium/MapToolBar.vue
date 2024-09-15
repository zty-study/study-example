<template>
  <div class="map-tool-bar-wrap flex-yc">
    <a-tooltip
      v-for="(tool, index) in toolList"
      :key="index"
      :content="tool.name"
      background-color="var(--theme-color)"
    >
      <div
        class="tool-item pointer"
        :class="{ active: tool.value === drawType }"
        @click="activated(tool.value, tool.config)"
      >
        <IconFont :name="tool.icon" :size="tool.size || 16" color="#fff" />
      </div>
    </a-tooltip>

    <a-divider direction="vertical" style="border-color: #fff" />

    <a-tooltip content="清除" background-color="var(--theme-color)">
      <div class="tool-item pointer" @click="clear()">
        <IconFont name="refresh-line" :size="16" color="#fff" />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
const { drawType, activated, handleDraw, clear } = drawMap(window.viewer)

const toolList = [
  {
    name: '画点',
    value: 'point',
    icon: 'checkbox-blank-circle-fill',
    size: 10,
    config: { color: '#2997f7' }
  },
  { name: '画线', value: 'line', icon: 'pencil-line' },
  { name: '广告牌', value: 'billboard', icon: 'map-pin-fill' },
  { name: '测距', value: 'distance', icon: 'ruler-fill' },
  { name: '扇形', value: 'sector', icon: 'gradienter-line' }
]

onMounted(() => {
  handleDraw()
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
