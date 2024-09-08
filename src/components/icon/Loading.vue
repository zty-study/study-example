<template>
  <div class="el-loading-mask">
    <div class="el-loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.el-loading-mask {
  position: absolute;
  z-index: 2000;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  .el-loading-spinner {
    top: 50%;
    margin-top: -21px;
    width: 100%;
    text-align: center;
    position: absolute;
  }
  .el-loading-spinner .circular {
    height: 42px;
    width: 42px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite;
  }
  .el-loading-spinner .path {
    -webkit-animation: loading-dash 1.5s ease-in-out infinite;
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: $base-primary;
    stroke-linecap: round;
  }

  @keyframes loading-rotate {
    to {
      transform: rotate(1turn);
    }
  }
}
</style>
