<!--
 * @Author: mayi
 * @Date: 2018-12-14 10:13:49
 * @LastEditors: mayi
 * @LastEditTime: 2018-12-21 10:27:35
 * @Description: 图片点击放大
 * @使用方式  <el-img  src="src" alt="alt"><>
 -->
<template>
  <div class="elimg flex">
    <img
      class="defautl-show"
      ref="enlargeImg"
      v-bind:src="src"
      v-bind:alt="alt"
      @click="showEnlarge"
    >
    <transition name="fade">
      <div
        class="img-view"
        v-show="isShowEnlarge"
        @click="showEnlarge"
      >
        <!-- 遮罩层 -->
        <div class="img-layer"></div>
        <div
          class="img flex"
          ref="enlargeBox"
        >
          <img
            ref="enlargeImg"
            v-bind:src="src"
            v-bind:alt="alt"
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowEnlarge: false
    }
  },
  props: ['src', 'alt'],
  methods: {
    showEnlarge () {
      console.log(this.isShowEnlarge)
      this.isShowEnlarge = !this.isShowEnlarge
      if (this.isShowEnlarge) {
        this.setPos()
      }
    },
    setPos () {
      let enlargeImg = this.$refs.enlargeImg
      let naturalWidth = enlargeImg.naturalWidth
      let naturalHeight = enlargeImg.naturalHeight
      if (naturalWidth >= naturalHeight) {
        enlargeImg.style.width = '100%'
        enlargeImg.style.height = 'auto'
        enlargeImg.style.paddingTop =
          (700 - (700 * naturalHeight) / naturalWidth) / 2 + 'px'
      } else {
        enlargeImg.style.width = 'auto'
        enlargeImg.style.height = '100%'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.elimg {
  vertical-align: inherit;
  width: 100%;
  height: 100%;
}
.defautl-show {
  cursor: pointer;
  width: 100%;
  height: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
  transform: translate3D(0, 0, 0);
}
.fade-enter,
.fade-leave-active {
  transform: translate3D(0, 0, 0);
}
.img-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0000003d;
  z-index: 999;
  display: table;
}
.img-view .img-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.img-view .img {
  width: 700px;
  height: 700px;
  overflow: hidden;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -350px;
  margin-top: -350px;
  z-index: 1000;

  img {
    width: 100%;
    display: block;
    margin: auto;
  }
}
</style>



