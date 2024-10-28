<template>
  <!-- 弹出层 编辑同住人 -->
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
        <p class='item-info validate-required'>同住人姓名：
          <el-input style="width: 100px" class="edit-renter-cohabit" placeholder='请输入真实姓名'
                    v-model="renterName"
                    name="renterName"
                    v-validate="'required|renterName'">
          </el-input>
          <span v-show="errors.has('renterName')"
                class="validate-style">{{errors.first('renterName')}}</span>
        </p>
        <p class='item-info validate-required' style="display: flex">同住人证件：
          <el-select
            class="edit-renter-cohabit"
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
          <span>
              <el-input
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
          <span style="width: 180px;">
              <el-input
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
        </p>

        <p class='item-info'>
          <span class='item-info-label validate-required'>同住人手机</span>：
          <span class='relet-time'>
            <el-input placeholder='请输入同住人电话' v-model="mobile"
                      name="mobile"
                      v-validate="'required|mobile'"></el-input>
             <span v-show="errors.has('mobile')"
                   class="validate-style">{{errors.first('mobile')}}
            </span>
          </span>
        </p>
        <p class='item-info'>
          <span class='item-info-label validate-required'>同住人性别</span>：
          <el-select
            class="edit-renter-cohabit"
            v-model='gender'
            placeholder='请选择'
          >
            <el-option
              v-for='item in genders'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!--<div class='renter-info'>-->
        <!--<p class='item-info validate-required'>紧急联系人：-->
          <!--<span class='relet-time'>-->
            <!--<el-input placeholder='请输入联系人姓名'-->
                      <!--v-model="urgentName"-->
                      <!--name="urgentName"-->
                      <!--v-validate="'required|urgentName'"></el-input>-->
            <!--<span v-show="errors.has('urgentName')"-->
                  <!--class="validate-style">{{errors.first('urgentName')}}-->
            <!--</span>-->
          <!--</span>-->
        <!--</p>-->
        <!--<p class='item-info validate-required'>联系人电话：-->
          <!--<span class='relet-time'>-->
            <!--<el-input placeholder='请输入联系人电话' v-model="urgentMobile"-->
                      <!--name="urgentMobile"-->
                      <!--v-validate="'required|urgentMobile'"></el-input>-->
             <!--<span v-show="errors.has('urgentMobile')"-->
                   <!--class="validate-style">{{errors.first('urgentMobile')}}-->
            <!--</span>-->
          <!--</span>-->
        <!--</p>-->
      <!--</div>-->
      <div class='renter-info'>
        <p class='item-info validate-required'>租约： {{ctime|date-formatD}} 至 {{mtime|date-formatD}}</p>
      </div>
      <div class="renter-body-button">
        <div class='common-button common-button-compile' @click="getAddOrUpateRenterinfo">提交</div>
      </div>
    </template>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import { reqUpateRenterinfo } from '../../base/request/api'

  export default {
    props: {
      houseAddress: String,
      updateId: Number,
      checkinEtartDate: String,
      checkinEndDate: String,
      ownedProvince:String,
      ownedCity:String,
      ownedDistrict:String,
    },
    data () {
      return {
        renterName: '',
        credentialsType: '',
        credentialsTypeName: '',
        mobile: '',
        gender:'',
        urgentName:'',
        urgentMobile:'',
        ctime:'',
        mtime:'',
        credentialsNo:'',
        credentialsNoIdentity: '',//身份证
        credentialsNoPassport: '',//护照
        credentialsTypes: [
          {label: '身份证', value: '1'},
          {label: '护照', value: '2'},
        ],
        genders: [
          {label: '男', value: '1'},
          {label: '女', value: '0'}
        ],
      }
    },
    methods: {
      closeRelet () {
        this.$parent.isShowEditLive = false
      },
      getAddOrUpateRenterinfo () {
        this.$validator.validateAll().then(async result => {
          if (result) {
            const {houseId, roomId, typeHouse} = this.$route.params
            const {updateId, renterName,credentialsType,mobile,gender,urgentName,urgentMobile} = this
            let credentialsNo
            if(credentialsType == '1'){
              credentialsNo = this.credentialsNoIdentity //身份证
            }else if(credentialsType == '2'){
              credentialsNo = this.credentialsNoPassport //护照
            }
            const result = await reqUpateRenterinfo(updateId,renterName,credentialsType,credentialsNo,mobile,gender,urgentName,urgentMobile)
            //console.log(result)
            if (result.code === '200') {
              this.$parent.isShowEditLive = false
              this.$store.dispatch('getHouseRoomList', {houseId, roomId, rentType:typeHouse})
              this.$message({
                showClose: true,
                message: '修改成功！',
                type:'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '出错！',
                type: 'warning',
              })
            }
          }
        })
      },

    },
    watch:{
      tenantInfo(){
        this.$nextTick(()=>{
          //console.log(this.tenantInfo)
          this.renterName = this.tenantInfo.renterName
          this.credentialsType = this.tenantInfo.credentialsType
          if(this.tenantInfo.credentialsType == '1'){
            this.credentialsNoIdentity = this.tenantInfo.credentialsNo
          }else if(this.tenantInfo.credentialsType == '2'){
            this.credentialsNoPassport = this.tenantInfo.credentialsNo
          }
          this.mobile = this.tenantInfo.mobile
          this.gender = this.tenantInfo.gender
          this.urgentName = this.tenantInfo.urgentName
          this.urgentMobile = this.tenantInfo.urgentMobile
          this.ctime = this.tenantInfo.ctime
          this.mtime = this.tenantInfo.mtime
        })
      },
    },
    computed: {
      ...mapState(['tenantInfo'])
    },
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
        .edit-renter-cohabit{
          width: 100px;
          margin-right: 10px;
          .el-input{
            width: 100px;
          }
        }
        .relet-time {
          margin-right: 5%;
          margin-left: 0px;
          .el-date-editor {
            width: 145px;
          }
        }
        .el-input {
          display: inline-block;
          width: 180px;
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
      }
      &:last-child {
        border: 0;
      }
    }
    .renter-body-button{
      .common-button-compile {
        margin: 0 auto;
      }
    }
  }
</style>

