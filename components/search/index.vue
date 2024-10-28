<template>
  <div class="flex">
    <el-input v-model.trim="searchValue" class="mr-10" :placeholder="newPlaceholder" :clearable="clearable">
        <i v-if="!searchKeywordTypes" slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-select v-else="searchKeywordTypes" v-model="searchKeywordType" slot="prepend">
          <el-option
            v-for="searchKeyword in searchKeywordTypes"
            :key="searchKeyword.key"
            :label="searchKeyword.value"
            :value="searchKeyword.key"
          ></el-option>
        </el-select>
    </el-input>

    <div class="common-button mr-10" @click="search">搜索</div>
    <div class="common-button" @click="resetSearch">重置</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchValue: "",
      searchKeywordType: this.searchKeywordTypes
        ? this.searchKeywordTypes[0].key
        : null,
      newPlaceholder: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      required: true
    },
    searchKeywordTypes: Array,
    clearable: Boolean
  },
  methods: {
    //查询
    search() {
      console.log(this.searchValue, this.searchKeywordType);
      this.$emit("getSearch", this.searchValue, this.searchKeywordType);
    },
    //重置查询
    resetSearch() {
      this.searchKeywordType = this.searchKeywordTypes
        ? this.searchKeywordTypes[0].key
        : null;
      this.searchValue = "";
      this.$emit("resetSearch");
    }
  },
  watch: {
    searchKeywordType: {
      handler(newType, oldType) {
        if (newType) {
          const searchKeywordType = this.searchKeywordTypes.find(item => {
            return item.key === newType;
          });
          if (searchKeywordType) {
            this.newPlaceholder = searchKeywordType.placeholder;
          }
        } else {
          this.newPlaceholder = this.placeholder;
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss">
</style>

