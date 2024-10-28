<template>
  <el-dialog
    :width="width ? width : '50%'"
    :title="modalTitle ? modalTitle : ''"
    :visible.sync="dialogVisibleModal"
    :before-close="modalClose"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose || false"
    v-dialog-drag
    @opened="modalOpened"
    v-loading="showLoading"
  >
    <slot name="body"></slot>
    <span slot="footer" class="dialog-footer">
        <slot name="footer"></slot>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      showLoading: {
        type: Boolean,
        default: false
      },
      width: String,
      modalTitle:String,
      dialogVisibleModal:Boolean,
      destroyOnClose:Boolean
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      modalClose(done) {
        done();
        this.$emit("modalClose");
      },
      modalOpened() {
        this.$emit("modalOpend");
      },
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  .el-dialog__wrapper::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .el-dialog::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .el-dialog,.el-dialog__wrapper{
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-dialog{
    max-height: 80%;
  }
  .el-dialog__header{
    background: #595656;
  }
  .el-dialog__title{
    color: #ffffff;
  }
  .el-icon-close:before{
    color: #ffffff;
  }
  .el-loading-mask {
    background-color: rgba($color: #000000, $alpha: 0.7)

  }
</style>
