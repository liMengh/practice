<template>
    <div class="search-list">
        <div class="search-item"
                v-for="(searchConfig, index) in searchConfigs"
                :key="index"
        >
            <el-input
                    v-if="searchConfig.type === 'input'"
                    v-model="searchParams[searchConfig.paramKey]"
                    :placeholder="searchConfig.placeholder"
                    size="small"></el-input>
            <el-select
                    v-if="searchConfig.type === 'select'"
                    v-model="searchParams[searchConfig.paramKey]"
                    @change="selectItem(searchParams,searchConfig.paramKey)"
                    :placeholder="searchConfig.placeholder"
                    size="small"
            >
                <el-option
                        v-for="(selectConfig, index) in searchConfig.selectList"
                        :key="index"
                        :label="selectConfig.desc"
                        :value="selectConfig.code"
                ></el-option>
            </el-select>
            <el-select
                    ref="selectMultiple"
                    v-if="searchConfig.type === 'multiple'"
                    v-model="searchParams[searchConfig.paramKey]"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="searchConfig.placeholder"
                    :remote-method="((query) => {remoteMethod(query,searchConfig.reqUrl,searchConfig.searchKey)})"
                    size="small"
                    :loading="loading"
                    @visible-change="((val) => {visibleChangeSelectMultiple(val,searchConfig.paramKey)})"
                    @change="((val) => {selectedOption(val,searchConfig.paramKey,searchConfig.resultKey)})"
                    @clear="querySelectSearchClear(searchConfig.paramKey)">
                <el-option
                        v-for="item in searchMultipleOptions"
                        :key="item.enterpriseId"
                        :label="item.value"
                        :value="item.enterpriseId">
                </el-option>
            </el-select>
            <el-autocomplete
                    v-if="searchConfig.type === 'autocomplete'"
                    v-model.trim="searchModel[searchConfig.paramKey]"
                    :fetch-suggestions="((queryString, cb) => {querySearch(queryString, cb, searchConfig.reqUrl, searchConfig.searchKey,searchConfig.querySearchType, searchConfig.valueKey)})"
                    :placeholder="searchConfig.placeholder"
                    :trigger-on-focus="false"
                    @select="((val) => {handleSelect(val, searchConfig.paramKey, searchConfig.resultKey)})"
                    size="small"
                    clearable
                    @clear="querySearchClear(searchConfig.paramKey)"
            ></el-autocomplete>
            <el-date-picker
                    v-if="searchConfig.type === 'datepicker'"
                    v-model="searchParams[searchConfig.paramKey]"
                    type="daterange"
                    range-separator="——"
                    :start-placeholder="searchConfig.startPlaceholder"
                    :end-placeholder="searchConfig.endPlaceholder"
                    :picker-options="pickerOptions"
                    size="small"
                    @change="selectDruingDate"
                    :default-time="['00:00:00', '23:59:59']"
                    :clearable="true"
                    value-format="timestamp"
            ></el-date-picker>
            <el-date-picker
                    v-if="searchConfig.type === 'datepicker-date'"
                    v-model="searchParams[searchConfig.paramKey]"
                    type="date"
                    :placeholder="searchConfig.placeholder"
                    size="small"
                    @change="selectDruingDate"
                    :clearable="false"
                    value-format="timestamp"
            ></el-date-picker>
            <el-date-picker
              v-if="searchConfig.type === 'datepicker-year'"
              style="width: 182.5px"
              type="year"
              :clearable="false"
              size="small"
              :picker-options="yearPickerOptions"
              v-model="searchParams[searchConfig.paramKey]"
              @change="selectDruingDate">
            </el-date-picker>
            <el-cascader
                    v-if="searchConfig.type === 'cascader'"
                    v-model="searchParams[searchConfig.paramKey]"
                    size="small"
                    debounce
                    :clearable="false"
                    :show-all-levels="false"
                    :options="searchConfig.cascaderOptions"
                    :props="searchConfig.cascaderProps"
                    @change="selectDruingDate"
                    :placeholder="searchConfig.placeholder"
            >
            </el-cascader>
        </div>
    </div>
</template>

<script>
import {reqRegionList, reqGetSearch, reqPostSearch} from "@/base/request/api";

export default {
  props: {
    searchConfigs: Array,
    selectItem: Function,
  },
  data() {
    return {
      provinceArr: [],
      status: "",
      timeout: null,
      searchParams: {},
      searchModel: {},
      tempArr: [
        {
          value: "无数据",
          code: "-1",
        },
      ],
      yearPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() || time.getTime() < new Date(2018, 4, 2)
        }
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              let start = new Date();
              let today = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 0, 0, 0);
              const end = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 23, 59, 59);
              start.setTime(today.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              let start = new Date();
              let today = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 0, 0, 0);
              const end = new Date(start.getFullYear(), start.getMonth(), start.getDay(), 23, 59, 59);
              start.setTime(today.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchMultipleOptions: []
    };
  },
  watch: {
    searchConfigs: {
      handler(newSearchConfigs, oldSearchConfigs) {
        newSearchConfigs.map(searchConfig => {
          if (searchConfig.defaultValue && searchConfig.defaultValue.length > 1) {
            this.searchParams[searchConfig.paramKey] = searchConfig.defaultValue
          }
        })
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    //清除多选搜索
    querySelectSearchClear() {
      this.selectItem(this.searchParams);
    },
    //多选下拉框隐藏
    visibleChangeSelectMultiple(val, paramKey) {
      if (this.searchMultipleOptions) {
        this.searchMultipleOptions = this.searchMultipleOptions.filter(item => this.searchParams[paramKey].indexOf(item.enterpriseId) > -1);
      }
    },
    //选中多选搜素
    selectedOption(val, paramKey) {
      this.$refs.selectMultiple[0].query = "";
      this.selectItem(this.searchParams);
    },
    unique(arr) {
      // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
      let obj = {};
      arr = arr.reduce(function (item, next) {
        let enterpriseId = obj[next.enterpriseId] ? "" : obj[next.enterpriseId] = true;
        if (enterpriseId) item.push(next)
        return item;
      }, []);
      console.log(arr)
      return arr
    },
    //多选搜素数据获取
    async remoteMethod(query, url, searchKey) {
      if (query !== "") {
        this.loading = true;
        let params = {};
        params[searchKey] = query;
        const request = await reqSearch(url, params);
        this.loading = false;
        this.searchMultipleOptions = this.searchMultipleOptions.concat(request.data.records || []);
        this.searchMultipleOptions = this.unique(this.searchMultipleOptions);
      }
    },
    selectDruingDate() {
      this.selectItem(this.searchParams);
    },
    resetSearchMultipleOptions() {
      this.searchMultipleOptions = [];
    },
    async querySearch(queryString, cb, url, searchKey,querySearchType, valueKey) {
      if (queryString && queryString.length === 0) return cb([]);
      let params = {};
      params[searchKey] = queryString;
      if (querySearchType === "post"){
        const request = await reqPostSearch(url, params);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const records = request.data || [];
          records.map(item => {
            item.value = item[valueKey]
          })
          if (records.length === 0) {
            cb(this.tempArr || []);
          } else {
            cb(records);
          }
        }, 1000 * Math.random());
      }else {
        const request = await reqGetSearch(url, params);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const records = request.data.records || [];
          if (records.length === 0) {
            cb(this.tempArr || []);
          } else {
            cb(records);
          }
        }, 1000 * Math.random());
      }
    },
    handleSelect(val, paramKey, resultKey) {
      if (val.code === "-1") {
        return (
          (this.searchModel[paramKey] = ""), (this.searchParams[paramKey] = "")
        );
      }
      this.searchParams[paramKey] = val[resultKey];
      this.selectItem(this.searchParams, paramKey);
    },
    querySearchClear(paramKey) {
      this.searchModel[paramKey] = "";
      this.searchParams[paramKey] = "";
      this.selectItem(this.searchParams);
    },
    getSearchParams() {
      return this.searchParams;
    },
    clearSearchParams() {
      this.searchConfigs.map((item) => {
        Vue.set(this.searchParams, item.paramKey, "");
        Vue.set(this.searchModel, item.paramKey, "");
      });
    },
    clearSearchSingleParams(item) {
      Vue.set(this.searchParams, item, "");
    },
  },
  created() {
    this.clearSearchParams();
  },
};
</script>

<style lang='scss'>
    .search-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .search-item{
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
</style>
