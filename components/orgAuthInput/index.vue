<template>
  <div class="org-input" v-show = isShowCascader>
    <el-cascader
      ref="cascader"
      size="small"
      debounce
      :clearable="false"
      :show-all-levels="false"
      :options="options"
      :props="props"
      v-model="selectOrg"
      @change="handleChange"
    >
    </el-cascader>
  </div>
</template>

<script>
import { reqAllBranchsByBrhNo } from "../../base/request/api";
export default {
  props: {
    selectedOrg: String,
    isKeyOrg: Boolean,
    enterPriseId: String
  },
  data() {
    return {
      isShowCascader:true,
      selectFirstItem: false,
      selectOrg: "",
      isClearValue:false,
      props: {
        // expandTrigger: "hover",
        checkStrictly: true
      },
      options: []
    };
  },
  methods: {
    async reqOrgList(enterpriseId = "") {
      let brhNo;
      if (this.isKeyOrg) {
        brhNo = 0;
      }
      this.isShowCascader = true
      if (enterpriseId === 'empty'){
        return (this.isShowCascader = false,
        this.options = [])
      }
      const request = await reqAllBranchsByBrhNo(brhNo, enterpriseId);
      this.options = request.data.organizationArr || [];

      if (this.options.length > 0 && this.selectedOrg) {// 已有选中机构
        this.selectOrg = this.selectedOrg;
        this.handleChange([this.selectOrg]);
      } else if (this.options.length > 0 && !this.selectedOrg) {// 无选中机构选首选项
        this.selectOrg = this.options[0].value;
        this.handleChange([this.selectOrg]);
      }
    },
    handleChange(value) {
      if(this.isClearValue){
        this.clearValue()
      }
      this.$emit("selectOrg", value[value.length - 1]);
      this.isClearValue = true
    },
    clearValue(){
      this.$refs.cascader.$children[0].$refs.input.click()
    },
    openSelect () {
      this.$refs.cascader.$children[0].$refs.input.click();
    }
  },
  watch: {
    enterPriseId: {
      handler(newEnterPriseId, oldEnterPriseId) {
        this.reqOrgList(newEnterPriseId);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss">
.el-cascader .el-input .el-input__inner:focus,
.el-cascader .el-input.is-focus .el-input__inner {
  border-color: #ffaa36;
}

.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
  color: #ffaa36;
  font-weight: 700;
}
</style>
