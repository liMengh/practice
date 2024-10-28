<template>
  <div class="billHeader">
    <div class="container">
      <template v-if="tableTitle.split('|')">
        <div v-for="(item, i) in tableTitle.split('|')" :key="i">
          <div class="title inline" v-if="i == 0"><b>{{item}}</b></div>
          <template v-else-if="item.includes('$')">
            <div class="inline" :key="id" v-for="(o, id) in getContent(item)">
              <span class="red" v-if="/(^¥[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(o)" >{{o}}</span>
              <span v-else>{{o}}</span>
            </div>
          </template>
          <span v-else>{{item}}</span>
          <el-divider v-if="(+i!== tableTitle.split('|').length - 1)" direction="vertical"></el-divider>
        </div>
      </template>
    </div>
    <div v-if="options" class="offsetTop10">
      <el-select v-model="value" @change="statusChange" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: Array,
    statusChange: Function,
    tableTitle: String,
    value: String,
  },
  data() {
    return {
    }
  },
  computed: {
    getContent: (text) => {
      return (text) => text.split('$')
    }
  },
  watch: {
    titleList(newProps, oldProps) {
      console.log('watch', newProps, oldProps)
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
  .billHeader {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    .red {
      color: red;
      font-size: 18px;
    }
    .offsetTop10{
      margin-top: -10px;
      width: 120px;
    };
    .sm {
      font-size: 14px;
    }
    .container {
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      .inline {display: inline-block;}
      .el-divider--vertical {
        background-color: #303133;
      }
      span {
        vertical-align: middle;
      }
    }
  }
</style>
