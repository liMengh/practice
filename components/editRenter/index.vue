<template>
  <!-- 弹出层 编辑 -->
  <modal
    @close='closeRelet'
    class='relet-modal medium'
  >
    <template slot='header'>
      编辑
    </template>
    <template
      slot='body'
      class='relet-body'
    >
      <div class='renter-info'>
        <p class='item-info'>房源地址：{{houseAddress}}</p>
        <p class='item-info flex'>
          <span class='item-info-label validate-required'>承租人姓名</span>：
          <span class='value'>
            <el-input placeholder='请输入真实姓名'
                      v-model="renterName"
                      name="renterName"
                      v-validate="'required|renterName'">
            </el-input>
            <span v-show="errors.has('renterName')"
                  class="validate-style">{{errors.first('renterName')}}</span>
          </span>
        </p>
        <p class='item-info flex'>
          <span class='item-info-label validate-required'>承租人证件</span>：
          <span class='value edit-renter-certificate' style="display: flex">
            <el-select
              v-model='credentialsType'
              placeholder='请选择'
            >
              <el-option
                v-for='item in credentialsTypes'
                v-bind:key='item.value'
                v-bind:label='item.label'
                v-bind:value='item.value'
              >
              </el-option>
            </el-select>
            <!-- v-if="credentialsType == '2'"-->
            <span>
              <el-input
                style="width: 180px"
                v-if="credentialsType == '2'"
                class='id-number'
                placeholder='请输入护照号码'
                v-model="credentialsNoPassport"
                name="credentialsNoPassport"
                v-validate="'required|credentialsNoPassport'">
            ></el-input>
            <span v-if="errors.has('credentialsNoPassport') && credentialsType == '2'"
                  class="validate-style">{{errors.first('credentialsNoPassport')}}
            </span>
            </span>
            <span>
              <el-input
                style="width: 180px"
                v-if="credentialsType == '1'"
                class='id-number'
                placeholder='请输入身份证号码'
                v-model="credentialsNoIdentity"
                name="credentialsNoIdentity"
                v-validate="'required|credentialsNoIdentity'">
            ></el-input>
            <span v-if="errors.has('credentialsNoIdentity') && credentialsType == '1'"
                  class="validate-style">{{errors.first('credentialsNoIdentity')}}
            </span>
            </span>
          </span>
        </p>
        <p class='item-info flex'>
          <span class='item-info-label validate-required'>承租人手机</span>：
          <span class='relet-time'>
            <el-input placeholder='请输入承租人电话' v-model="mobile"
                      name="mobile"
                      v-validate="'required|mobile'"></el-input>
             <span v-show="errors.has('mobile')"
                   class="validate-style">{{errors.first('mobile')}}
            </span>
          </span>
        </p>
        <p class='item-info flex'>
          <span class='item-info-label validate-required'>承租人性别</span>：
          <span class='value'>
            <el-select
              class="edit-renter-certificate"
              v-model='gender'
              placeholder='请选择'
            >
              <el-option
                v-for='item in genders'
                v-bind:key='item.value'
                v-bind:label='item.label'
                v-bind:value='item.value'
              >
              </el-option>
            </el-select>
          </span>

        </p>
      </div>
      <div class='renter-info '>
        <p class='item-info'>
          <span class='item-info-label'>紧急联系人</span>：
          <span class='relet-time'>
            <el-input placeholder='请输入联系人姓名'
                      v-model="urgentName"
                      name="urgentName"
                      v-validate="'urgentName'"></el-input>
            <span v-show="errors.has('urgentName')"
                  class="validate-style">{{errors.first('urgentName')}}
            </span>
          </span>
        </p>
        <p class='item-info'>
          <span class='item-info-label'>联系人电话</span>：
          <span class='relet-time'>
            <el-input placeholder='请输入联系人电话' v-model="urgentMobile"
                      name="urgentMobile"
                      v-validate="'urgentMobile'"></el-input>
             <span v-show="errors.has('urgentMobile')"
                   class="validate-style">{{errors.first('urgentMobile')}}
            </span>
          </span>
        </p>
      </div>
      <div class='renter-info'>
        <p class='item-info'>租约： {{checkinEtartDate}} 至 {{checkinEndDate}}</p>
      </div>
      <div class="renter-body-button">
        <div class='common-button common-button-compile' @click="getAddOrUpateRenterinfo">提交</div>
      </div>
    </template>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import { reqAddOrUpateRenterinfo } from '../../base/request/api'

  export default {
    props: {
      houseAddress: String,
      updateId: Number,
      checkinEtartDate: String,
      checkinEndDate: String,
    },
    data () {
      return {
        reletTime: '',
        urgentName: '',
        urgentMobile: '',
        mobile: '',
        startDate: '2018/10/10',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        credentialsTypes: [
          {label: '身份证', value: '1'},
          {label: '护照', value: '2'},
        ],
        genders: [
          {label: '男', value: '1'},
          {label: '女', value: '0'}
        ],
        renterName: '',
        gender: '1',
        credentialsType: '1',
        credentialsNo: '',
        credentialsNoIdentity: '',//身份证
        credentialsNoPassport: '',//护照
      }
    },
    methods: {
      /**
       * @快捷选择一年两年
       */
      shortcutSetYear (num) {
        let date = this.utils.setDate(this.startDate, num)
        this.reletTime = date
      },
      closeRelet () {
        this.$parent.isShowEditRenter = false
      },
      getAddOrUpateRenterinfo () {
        if(this.credentialsType == '1'){
          this.credentialsNo = this.credentialsNoIdentity;
        }else if(this.credentialsType == '2'){
          this.credentialsNo = this.credentialsNoPassport;
        }
        this.$validator.validateAll().then(async result => {
          if (result) {
            const {houseId, roomId, typeHouse} = this.$route.params
            const {updateId,renterName,credentialsType,credentialsNo,mobile,gender,urgentName,urgentMobile} = this
            const result = await reqAddOrUpateRenterinfo(updateId,renterName,credentialsType,credentialsNo,mobile,gender,urgentName,urgentMobile)
            //console.log(result)
            if (result.code === '200') {
              this.$parent.isShowEditRenter = false
              this.$store.dispatch('getHouseRoomList', {houseId, roomId, rentType: typeHouse})
              this.$message({
                showClose: true,
                message: '修改成功！',
                type:'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '出错！',
                type:'warning'
              })
            }
          }
        })
      },
      attachedValue () {
        this.mobile = this.houseRoomList.renterVo.mobile
        this.renterName = this.houseRoomList.renterVo.renterName
        this.credentialsType = this.houseRoomList.renterVo.credentialsType
        this.credentialsNo = this.houseRoomList.renterVo.credentialsNo
        if(this.credentialsType == '1'){
          this.credentialsNoIdentity = this.credentialsNo
        }else if(this.credentialsType == '2'){
          this.credentialsNoPassport = this.credentialsNo
        }
        this.urgentName = this.houseRoomList.renterVo.urgentName
        this.urgentMobile = this.houseRoomList.renterVo.urgentMobile
      }
    },
    computed: {
      ...mapState(['houseRoomList'])
    },
    mounted () {
      this.attachedValue()
    }
  }
</script>

<style lang='scss'>
  .relet-modal {
    .relet-body {
      padding-top: 1.25%;
    }
    .renter-info {
      padding-left: 6.6%;
      padding-bottom: 5%;
      border-bottom: 1px solid #f4f4f4;

      .item-info {
        margin-top: 3.3%;
        justify-content: flex-start;
        .item-info-label{
          width: 82px;
        }
        .relet-time {
          position: relative;
          margin-right: 5%;
          margin-left: 0px;
          .el-date-editor {
            width: 145px;
          }
        }
        .el-input {
          width: 180px;
        }
        .edit-renter-certificate {
          width: 100px;
          .el-input {
            display: inline-block;
            width: 100px;
            margin-right: 10px;
          }
        }
        .shortcut {
          width: 12.5%;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border: 1px solid #bfbfbf;
          background: #f6f6f6;
          border-radius: 4px;
          margin-right: 2.75%;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &:last-child {
            margin-right: 0;
          }
        }
        .value{
          position: relative;
          width: 180px;
        }
      }
      &:last-child {
        border: 0;
      }
    }
    .renter-body-button {
      .common-button-compile {
        margin: 0 auto;
      }
    }
  }
</style>

