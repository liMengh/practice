<template>
  <div class="back-factory">
    <el-upload
      action
      :class="{hide: !showUpload}"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :auto-upload="true"
      :limit="limit"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="uploadFile"
      :on-success="onSuccess"
      :on-error="onError"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      accept=".jpeg, .jpg, .png, .pdf"
      :disabled="disabled"
    >
      <i :class="[classType[type] ? classType[type] : 'el-icon-plus']"></i>
    </el-upload>
    <div class="upload-pictures-dialog">
      <el-dialog :visible.sync="dialogVisible" :modal="false" :modal-append-to-body="false">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
    <div class="back-progress" v-if="type === 'circulation'">
      <el-progress
        v-for="(value, index) in uploadFlags"
        :key="index"
        :ref="'uploadFlag' + index"
        type="circle"
        v-show="uploadFlags[index]"
        :percentage="uploadPercents[index]"
      ></el-progress>
    </div>
  </div>
</template>
<script>
import imageConversion from "image-conversion";
import UploadFile from "./uploadFile";
import { reqDeleteFile } from "@/base/request/api";
export default {
  props: {
    limit: Number,
    isShowTransformMenu: Boolean,
    fileShowList: [],
    sysFileShowInfoIds: [],
    type: String,
    disabled: Boolean
  },
  data() {
    return {
      showUpload: true,
      classType: {circulation: 'el-icon-plus circulation', deliver: 'el-icon-plus deliver', check: "el-icon-plus check"},
      dialogImageUrl: "",
      dialogVisible: false,
      uploadFlags: [],
      uploadPercents: [],
      fileList: [],
      sysFileInfoIds: []
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    updateList(fileList, sysFileInfoIds) {
      this.fileList = fileList;
      this.sysFileInfoIds = sysFileInfoIds;
    },
    getSysFileInfoIds() {
      return this.sysFileInfoIds;
    },
    getFileList() {
      return this.fileList;
    },
    beforeUpload(file) {
      // const fileType = [
      //   "image/png",
      //   "image/jpeg",
      //   "image/gif",
      //   "image/bmp"
      // ].find(item => {
      //   return file.type === item;
      // });
      // if (!fileType) {
      //   this.$message.error("上传的物流单只能是图片格式!");
      //   return false;
      // }
      Vue.set(this.uploadFlags, this.fileList.length, true);
      Vue.set(this.uploadPercents, this.fileList.length, 0);
      // return true;
      return new Promise((resolve, reject) => {
        let isLt1M = file.size / 1024 / 1024 < 1;
        const fileName = file.name;
        const fileType = fileName.slice(fileName.length - 3);
        const isPdf = ['pdf', 'PDF'].includes(fileType);
        if (isLt1M || isPdf) {
          resolve(file);
        } else {
          imageConversion.compressAccurately(file, 400).then(res => {
            resolve(res);
          });
        }
      });
    },
    async uploadFile(item) {
      const index = this.fileList.length;
      let _this = this;
      UploadFile.uploadPic(
        item.file,
        _this.type ? _this.type : "circulation",
        request => {
          console.log(request);
          if (request.code === "200") {
            this.sysFileInfoIds.splice(index, 0, request.data.id);
            this.fileList[index].fileUrl = request.data.fileUrl;
            // this.isShowFrontCard = this.fileList.length === this.limit;
          }else {
            this.$message.warning("上传图片失败");
            this.fileList.map((o,index) => {
              if (o.uid === item.file.uid){
                console.log("上传失败！！！！！！")
                console.log(index)
                setTimeout(()=>{
                  this.fileList.splice(index,1)
                },1000)
              }
            })
          }
        },
        complete => {
          Vue.set(_this.uploadPercents, index, complete);
        }
      );
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList;
      for (let index = 0; index < this.fileList.length; index++) {
        if (file.uid === this.fileList[index].uid) {
          this.clearProgress(index);
        }
      }
    },
    onError(err, file, fileList) {
      this.clearProgress(fileList.length);
      this.$message.warning("上传图片失败");
    },
    clearProgress(index) {
      setTimeout(() => {
        Vue.set(this.uploadFlags, index, false);
        Vue.set(this.uploadPercents, index, 0);
      }, 1000);
    },
    async beforeRemove(file, fileList) {
      // for (let index = 0; index < this.fileList.length; index++) {
      //   if (file.uid === this.fileList[index].uid && this.type !== 'installOrderPdf' && this.sysFileInfoIds.length > 0) {
      //     // 调用删除接口，未做成功与否判断
      //     await reqDeleteFile(this.sysFileInfoIds[index]);
      //   }
      // }
    },
    handleRemove(file, fileList) {
      for (let index = 0; index < this.fileList.length; index++) {
        if (file.uid === this.fileList[index].uid) {
          this.sysFileInfoIds.splice(index, 1);
        }
      }
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件！`);
    },
    resetData() {
      this.fileList = [];
      this.sysFileInfoIds = [];
    }
  },
  mounted() {
    // for (let index = 0; index < this.limit; index++) {
    //   document.getElementsByClassName("el-progress-circle")[
    //     index
    //   ].style.height = "86px";
    //   document.getElementsByClassName("el-progress-circle")[index].style.width =
    //     "86px";
    //   this.$refs["uploadFlag" + index][0].$el.style.position = "absolute";
    //   this.$refs["uploadFlag" + index][0].$el.style.left =
    //     8 + (100 + 8) * index + "px";
    // }
  },
  created() {
    for (let index = 0; index < this.limit; index++) {
      this.uploadFlags.push(false);
      this.uploadPercents.push(0);
    }
  },
  watch: {
    isShowTransformMenu() {
      if (!this.isShowTransformMenu) {
        // 隐藏时清除数据
        this.resetData();
      }
    },
    fileShowList() {
      this.fileList = this.fileShowList || [];
    },
    fileList() {
      this.showUpload = this.limit ? (this.fileList.length !== this.limit) : true;
    },
    sysFileShowInfoIds() {
      this.sysFileInfoIds = this.sysFileShowInfoIds|| [];
    }
  }
};
</script>
<style lang="scss">
.back-factory {
  .hide .el-upload--picture-card {
    display: none;
  }

  position: relative;
  margin-bottom: 25px;
  margin-left: 20px;
  .upload-pictures-dialog{
    .el-dialog__header{
      padding-top: 45px;
    }
  }
  .back-progress {
    position: absolute;
    top: 8px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 98px;
  }
  .el-icon-plus {
    margin-top: 30px;
  }
  .el-icon-plus:after {
    content: "上传图片";
    font-size: 14px;
    display: flex;
    margin-top: 10px;
  }
  .circulation:after {
    content: "上传物流单";
    font-size: 14px;
    display: flex;
    margin-top: 10px;
  }
  .check:after {
    content: "出厂检测证明";
    font-size: 14px;
    display: flex;
    margin-top: 10px;
  }
  .deliver:after {
    content: "物流发票";
    font-size: 14px;
    display: flex;
    margin-top: 10px;
  }
}
</style>
