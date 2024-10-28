<template>
  <transition name="modal-fade">
    <div class="modal-backdrop flex">
      <article
        class="modal flex"
        role="dialog"
        aria-labelledby="modalTitle"
      >
        <section class="modal-body" ref="modalBody" :style="{'max-height': modalHeight}">
          <slot name="body">
          </slot>
          <footer class="modal-footer">
            <slot name="footer">
            </slot>
          </footer>
        </section>
      </article>
    </div>
  </transition>

</template>

<script>
//import _ from 'lodash'
const _ = require('lodash')
export default {
  data () {
    return {
      premodalHeight: '',
      modalHeight: ''
    }
  },
  created () {
    this.premodalHeight = parseInt(window.innerHeight * 0.9 - 40)
  },
  methods: {
    close (e) {
      e.stopPropagation()
      this.$emit('close')
    },
    show (e) {
      e.stopPropagation()
      this.$emit('show')
    },
    resizeHeight () {
      this.modalHeight = parseInt(window.innerHeight * 0.9 - 40) + 'px'
    }
  },
  mounted () {
    this.modalHeight = this.premodalHeight + 'px'
    window.addEventListener('resize', _.debounce(this.resizeHeight, 300))
  }
}
</script>

<style lang="scss">
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all .5s ease;
}
.modal-fade-enter,.modal-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /*transform: translateX(100%);*/
    opacity: 0;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  &.mini {
    .modal {
      min-width: 400px;
      max-width: 480px;
      width: 25%;
    }
  }
  &.medium {
    .modal {
      min-width: 600px;
      max-width: 800px;
      width: 50%;
    }
  }
  &.renter-medium {
    .modal {
      min-width: 600px;
      max-width: 1000px;
      width: 90%;
    }
  }
  .modal {
    max-height: 90%;
    display: block;
    background: #fff;
    box-shadow: 2px 2px 20px 1px;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    .modal-header {
      height: 40px;
      line-height: 40px;
      color: #fff;
      background: #595658;
      font-size: 20px;
      font-family: Adobe Heiti Std R;
      font-weight: normal;
      padding: 0 20px;
      .btn-close {
        width: 18px;
        height: 18px;
        background: url(../../assets/images/close.png) no-repeat center center;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
    .modal-body {
      padding-bottom: 28px;
      overflow-y: auto;
      min-height: 90%;
    }
  }
}
</style>
