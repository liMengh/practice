<template>
  <div>
    <el-image class="video-img-url" :src="videoImgUrl" @click="dialogVisible = true"></el-image>
    <video v-show="false" id="video" preload="auto" crossorigin="anonymous" controls width="100px" height="100px">
      <source
        :src="videoUrl"
        type="video/mp4">
    </video>
    <el-dialog
      title="视频"
      :visible.sync="dialogVisible"
      destroy-on-close="true"
      width="90%"
      :before-close="handleClose">
      <div class="video-container">
        <video preload="auto" crossorigin="anonymous" controls width="600px" height="600px">
          <source
            :src="videoUrl"
            type="video/mp4">
        </video>
      </div>
      <span slot="footer" class="dialog-footer">
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    props:{
      videoUrl:String
    },
    data() {
      return {
        dialogVisible: false,
        videoImgUrl: this.videoUrl + '?spm=qipa250&x-oss-process=video/snapshot,t_1000,f_jpg,w_800,h_600,m_fast',
        videoUrl: this.videoUrl
      }
    },
    created() {

    },
    methods: {
      handleClose(done) {
        done();
      },
// 生成视频缩略图
//       videoPreview() {
//         let video;
//         let initialize = () => {
//           video = document.getElementById("video");
//           video.load();
//           console.log(video)
//           video.addEventListener("loadedmetadata", function () { //加载数据
//             setTimeout(() => {
//               captureImage();
//             }, 1000)
//           });
//         };
//         let captureImage = () => {
//           let canvas = document.createElement("canvas");
//           canvas.width = 100;
//           canvas.height = 100;
//           canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
//           this.videoImgUrl = canvas.toDataURL("image/png");
//         };
//         initialize();
//       },
      videoPreview(){
        this.videoImgUrl = this.videoUrl + '?spm=qipa250&x-oss-process=video/snapshot,t_1000,f_jpg,w_800,h_600,m_fast';
      }
    },
    mounted() {
      this.videoPreview();
    }
  }
</script>

<style lang="scss">
  .video-img-url{
    width: 100px;
    height: 100px;
  }
  .video-container{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
