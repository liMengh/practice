<template>
  <div class="info-detail">
    <div class="flex">
      <div class="order-header">{{ infoConfig.title }}</div>
      <div class="flex">
        <div
          v-for="(rightBtn, index) in infoConfig.rightBtns"
          :key="index"
          class="common-button rigth-btn mr-20"
          @click="clickFn(rightBtn.fn)"
        >
          {{ rightBtn.label }}
        </div>
      </div>
    </div>
    <el-row class="order-row">
      <el-col
        class="order-col"
        v-for="(info, index) in infoConfig.contents"
        :span="info.col || 6"
        :key="index"
      >
        <div v-if="info.type === 'popover'">
          {{ info.label + ": " }}
          <el-popover
            placement="top"
            width="250"
            trigger="hover"
            :content="orderDetail[info.popChild]"
          >
            <el-button
              slot="reference"
              type="text"
              style="color: black; font-weight: normal; font-size: 13px"
            >
              {{ orderDetail[info.child] }}
            </el-button>
          </el-popover>
        </div>
        <div v-else>{{ `${info.label}: ${orderDetail[info.child] || "无"}` }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    orderDetail: Object,
    infoConfig: Object,
  },
  methods: {
    clickFn(fn) {
      if (fn) {
        this.$emit("clickBtn", fn);
      }
    },
  },
};
</script>

<style lang="scss">
.info-detail {
  font-size: 13px;

  .order-header {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .rigth-btn {
    margin-left: 10px;
  }

  .order-row {
    margin-left: 20px;
    margin-bottom: 10px;

    .order-col {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>