<template>
  <div class="bill-table">
    <el-table
      :empty-text="getEmptyText"
      ref="multipleTable"
      v-loading="showLoading && loading"
      @selection-change="handleSelectionChange"
      :row-key="getRowKey"
      class="waper-table"
      style="width:100%"
      :max-height="maxHeight"
      border
      :size="size||'mini'"
      :data="dataSource"
      :header-cell-style="{background:'#F6F6F6'}"
      :show-summary="showSummary|| false"
      :summary-method="handleSummaries"
      :span-method="spanMethod"
      v-if="Array.isArray(conf)"
    >
        <el-table-column v-if="selectionable" type="selection" :reserve-selection="true"></el-table-column>
        <el-table-column align="center"  v-for="(item, i) in columnConf"
          :key="i"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope" v-if="item.child">
            <div class="inline" :key="id" v-for="(o, id) in item.child">
              <span :class="className ? className(o, scope.row[o]) : ''" v-if="!o.type">{{renderCb ? renderCb(o, scope.row[o]) : scope.row[o] | data-init}}</span>
              <span :class="className ? className(o, scope.row[o]) : ''" v-else-if="o.type == 'slot'">{{renderCbSlot ? renderCbSlot(o.props, scope.row) : o.props }}</span>
              <span :class="className ? className(o, scope.row[o]) : ''" v-else-if="o.type == 'slotHTML'" v-html="renderCbSlot ? renderCbSlot(o.props, scope.row) : o.props"></span>
              <span :class="className ? className(o, scope.row[o]) : ''" v-else-if="o.type == 'billDateRangeSlot'" v-html="dateRangeSlot ? dateRangeSlot(o.props, scope.row) : o.props"></span>
              <span :class="className ? className(o, scope.row[o]) : ''" v-else-if="o.type == 'multilayer'">{{renderCb ? renderCb(o, scope.row[o.outer][o.inLayer]) : (scope.row[o.outer] ? scope.row[o.outer][o.inLayer] : "无" )}}</span>
              <span v-else-if="o.type == 'time'">
                {{scope.row[o.props] | date-format}}
              </span>
              <div style="width: 100%;" v-else-if="o.type == 'image'">
                <span  v-for="(itemProp,index) in JSON.parse(scope.row[o.props])"
                       :key="index">
                  <el-image
                    style="width: 50px; height: 50px;margin-right: 5px"
                    :src="itemProp"
                    :preview-src-list="JSON.parse(scope.row[o.props])"
                  ></el-image>
                </span>
              </div>
              <el-select  v-else-if="o.type== 'select' && o.options" @change="(val) => onChange(val, o.fnKey, scope.row, scope.$index)" v-model="scope.row[o.props]"
                          :disabled="o.disabled == undefined ? scope.row.disabled : o.disabled" :placeholder="o.placeholder">
                  <el-option
                    v-for="item in o.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select  v-else-if="o.type== 'selectDiff' && o.options" @change="(val) => onChange(val, o.fnKey, scope.row, scope.$index)" v-model="scope.row[o.props]"
                          :disabled="o.disabled == undefined ? scope.row.disabled : o.disabled" :placeholder="o.placeholder">
                <el-option
                  v-for="item in scope.row[o.options]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-popover
                v-else-if="o.type== 'popover' && o.icon"
                placement="top"
                width="150"
                trigger="hover"
                :content="scope.row[o.props]">
                <el-button type="text" slot="reference"><i :class="o.icon"></i></el-button>
              </el-popover>
              <el-date-picker
                v-else-if="o.type=='datePicker'"
                v-model="scope.row[o.props]"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
              <el-date-picker
                style="width: 240px;"
                v-else-if="o.type=='daterange'"
                v-model="scope.row[o.props]"
                type="daterange"
                placeholder="选择日期"
                value-format="timestamp"
                :disabled="o.disabled == undefined ? scope.row.disabled : o.disabled">
              </el-date-picker>
              <el-input v-else-if="o.type == 'inputNum'" v-model.number="scope.row[o.props]" :maxlength="o.maxlength"  @input="() => tableKey(o, scope.$index)" :placeholder="o.placeholder" :disabled="o.disabled == undefined ? !!scope.row[o.disabledKey] : o.disabled"></el-input>
              <el-input v-else-if="o.type == 'input'" v-model="scope.row[o.props]"  @input="() => tableKey(o, scope.row)" :placeholder="o.placeholder || ''" :maxlength="o.maxlength" :disabled="o.disabled == undefined ? !!scope.row[o.disabledKey] : o.disabled"></el-input>
              <el-input v-else-if="o.type == 'textarea'" type="textarea" v-model="scope.row[o.props]" :placeholder="o.placeholder" :maxlength="o.maxlength"></el-input>
              <el-dropdown v-else-if="o.type =='dropdown' && (o.isPrivilege ? !o.isPrivilege : true) && (o.showOutMoreKey ? scope.row[o.showOutMoreKey] : true)" @command="handleCommand">
                <el-button class="btn" type="text" size="small">{{o.text}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{fnKey:menu.fnKey, row: scope.row}" :key="index" v-for="(menu, index) in o.items">
                    <span v-if="!menu.isPrivilege">
                      {{(menu.showKey && scope.row[menu.showKey]) || !menu.showKey ? menu.text : ''}}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                v-else-if="o.type == 'btn' && o.fnKey && !o.isPrivilege && (o.showKey ? (scope.row[o.showKey] || false) : true) && (o.showOutMoreKey ? (scope.row[o.showOutMoreKey] || false) : true) && (o.detectionIsPay ? !scope.row[o.isPayBoolean] : true)"
                type="text"
                size="small"
                @click="callback(o.fnKey, scope.row,scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'btnWithIndex' && o.fnKey && !o.isPrivilege"
                type="text"
                size="small"
                @click="callbackWithIndex(o.fnKey, scope.row, scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'inventoryBtn' && o.fnKey && +scope.row[o.teamSign] === 1"
                type="text"
                size="small"
                @click="callback(o.fnKey, scope.row,scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'inventoryForbiddenBtn' && o.fnKey && +scope.row[o.teamType] === 0"
                type="text"
                size="small"
                @click="callback(o.fnKey, scope.row,scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'button' && o.fnKey && decideButton(scope.row[o.isShowBtn],o.decideValue)"
                type="text"
                size="small"
                @click="callback(o.fnKey, scope.row,scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'buttonTwo' && o.fnKey && decideButtonSecond(scope.row[o.isShowBtnSecond],o.decideValueSecond) && decideButton(scope.row[o.isShowBtn],o.decideValue)"
                type="text"
                size="small"
                @click="callback(o.fnKey, scope.row,scope.$index)"
                class="btn">{{o.text}}
              </el-button>
              <el-button
                v-else-if="o.type == 'noHave' && decideButton(scope.row[o.isShowBtn],o.decideValue)"
                type="text"
                size="small"
                class="btn">{{o.text}}
              </el-button>
            </div>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { reqUpateRenterinfo } from '../../base/request/api'

  export default {
    props: {
      showLoading: {
        type: Boolean,
        default: true
      },
      maxHeight: String,
      size:String,
      border: Boolean,
      showSummary: Boolean,
      conf: Array,
      dataSource: Array,
      callback: Function,
      callbackWithIndex: Function,
      className: Function,
      renderCb: Function,
      renderCbSlot: Function,
      dateRangeSlot: Function,
      getSummaries: Function,
      spanMethod:Function
    },
    data () {
      return {
        rowKey: "",
        timer: null,
        loading: false,
        selectionable: false,
        selectColumns: []
      }
    },
    methods: {
      tableKey(o, i){
        if (o.fnKey) {
          this.callback(o.fnKey, i);
        }
      },
      getRowKey(row) {
        return this.rowKey ? row[this.rowKey] : 1;
      },
      handleCommand(o) {
        this.callback(o.fnKey, o.row);
      },
      handleSummaries(param) {
        if(!this.getSummaries) return [];
        return this.getSummaries(param);
      },
      onChange(param, fnKey, row, index){
        if(fnKey) this.callback(fnKey, row, index);
      },
      handleSelectionChange(val) {
        this.selectColumns = val;
      },
      getSelectColumns() {
        return this.selectColumns;
      },
      resetSelect() {
        this.selectColumns = [];
        this.$refs.multipleTable.clearSelection();
      },
    },
    created() {
      // if(this.showLoading) {
      //   if(this.dataSource.length > 0) {
      //     this.loading = false;
      //   } else {
      //     this.loading = true;
      //     this.timer = setTimeout(() => {
      //       this.loading = false;
      //     }, 3000);
      //   }
      // }
    },
    beforeDestroy() {
      // if (this.timer) {
      //   clearTimeout(this.timer)
      // }
    },
    watch: {
      // dataSource() {
      //   this.loading = false;
      //   if (this.timer) {
      //     clearTimeout(this.timer)
      //   }
      // }
    },
    computed: {
      getEmptyText() {
        return this.loading ? " " : "暂无数据";
      },
      columnConf() {
        return this.conf.filter(item => {
          if (item.type === 'selection') {
            this.selectionable = true;
            this.rowKey = item.rowKey;
          }
          return !item.type;
        });
      },
      decideButton(){
        return (onLine,locality,) => {
          console.log("onLine",onLine)
          console.log("locality",locality)
          let tmpSign = false;
          if (Array.isArray(locality)){
            locality.map((item) => {
              if (onLine == item){
                tmpSign = true;
              }
            })
          }else {
            tmpSign = !!onLine;
          }
          return tmpSign;
        }
      },
      decideButtonSecond(){
        return (onLine,locality,) => {
          console.log("onLine",onLine)
          console.log("locality",locality)
          let tmpSign = false;
          if (Array.isArray(locality)){
            locality.map((item) => {
              if (onLine == item){
                tmpSign = true;
              }
            })
          }else {
            tmpSign = !!onLine;
          }
          return tmpSign;
        }
      }
    },
  }
</script>

<style lang='scss'>
  .bill-table{
    .el-table__header-wrapper {
      background: rgb(246, 246, 246);
    }
    .el-table {
      margin-top: 0px;
    }
    .inline {
      display: inline;
      span {
        margin: 0 1px;
      }
      .el-button {
        margin: 0 4px;
      }
    }
    .btn {
      color: #FFAA36;
    }
    .waper-table{
      .el-table .cell, .el-table th div {
        text-overflow: clip;
      }
    }
    .red{
      color: red;
    }
  }

</style>

