<template>
    <div class="demo-02-page card-bg bg-5">
      <section>
        <div class="circle-base"></div>
        <div
          class="hero-wrap"
          v-for="(item, index) in imgList"
          :key="index"
          :style="{
            transform: `rotateY(${(index * 360) / imgList.length}deg) translateZ(450px)`
          }"
        >
          <img :src="item.avatar" :alt="item.name" />
          <div class="hero-name">
            <span>{{ item.name }}</span>
            <span class="back">{{ item.name }}</span>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  const imgList = [
    {
      name: '少司缘',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/public/eb229d578ec9a04f9b2df4d82bcd9142.jpg?sign=1725684759-BC5c2H-0-48f20cb82a13118b4da75d1a77f66cef&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '敖隐',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/public/fa985fe39cb9e41a7baee0a265ad97c7.jpg?sign=1725684865-A8vbfw-0-d1618686847ad908f61998554e2542ac&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '伽罗',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20190829/41e44d62d91db2739c351e7fd0a98540_20190829105226.jpg?sign=1725684886-YRYRLI-0-3135c540317953f0999a5ee8ffc09854&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '诸葛亮',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20210525/cff5434cc837120f053bb6b56c76be4d_1621934528.jpg?sign=1725684903-PEj7rG-0-9dba90f0896bc69e63221e8e537154fa&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '甄姬',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20190829/5ef662393016150896a7eca6c8c3d5cc_20190829104629.jpg?sign=1725684837-X8k6J2-0-b81ff142db04962367fe76c8b5c82971&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '后羿',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/public/05cb7414d60398166fdb9feedbfb7763.jpg?sign=1725684920-555Chn-0-0894fdf17aa0c9a5f252f487dc780290&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '庄周',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20210525/26aa640de84c403e84ba28a40b2caa7e_1621934687.jpg?sign=1725684936-jcrG1a-0-1b9fcc476b4173253c886c373b009526&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '梦奇',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20210524/870db1370c25847023ced08d91debcbc_1621848813.jpg?sign=1725710523-4iRUXW-0-715134c29b3619beb6ae82dbac51deb0&imageMogr2/strip/format/webp/quality/80!'
    },
    {
      name: '百里守约',
      avatar:
        'https://lcmimage.ecology.smoba.qq.com/source/20190829/d0a7fe2827c001092e1eae4cc44532f1_20190829105507.jpg?sign=1725710567-J2Tc9E-0-4ac556ae3d479a3155af67b1cc90ca41&imageMogr2/strip/format/webp/quality/80!'
    }
  ]
  </script>
  
  <style lang="scss" scoped>
  .demo-02-page {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1500px;
  
    .circle-base {
      height: 1000px;
      width: 1000px;
      border: 2px solid #3f51b5;
      position: absolute;
      transform-style: preserve-3d;
      transform: rotateX(90deg) translateZ(-50px);
      border-radius: 50%;
    }
  
    section {
      margin-bottom: 100px;
      padding: 20px;
      width: 180px;
      height: 100px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      animation: rotate v-bind('`${imgList.length * 5}s`') linear infinite;
  
      &:hover {
        animation-play-state: paused;
      }
  
      .hero-wrap {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        position: absolute;
        transform-style: preserve-3d;
  
        .hero-name {
          color: #fff;
          font-size: 12px;
          text-align: center;
          transform-style: preserve-3d;
          position: relative;
  
          span {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            backface-visibility: hidden;
            &.back {
              transform: rotateY(180deg) translateX(50%);
            }
          }
        }
  
        img {
          height: 100%;
          width: 100%;
          border-radius: 5px;
          object-fit: cover;
          border: 1px solid #fff;
          /* 设置元素的倒影效果，below是倒影效果在元素下方，15px是元素和倒影的距离，后面的属性是设置倒影渐变 */
          -webkit-box-reflect: below 25px -webkit-linear-gradient(transparent 40%, rgba(255, 255, 255, 0.1));
        }
      }
    }
  
    @keyframes rotate {
      0% {
        transform: rotateX(-10deg) rotateY(0deg);
      }
      100% {
        transform: rotateX(-10deg) rotateY(360deg);
      }
    }
  }
  </style>
  