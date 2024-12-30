<template>
  <view>
    <Dialog v-if="dialogVisible"
            :title="dialogOptions.title"
            :content="dialogOptions.content"
            @confirm="onDialogConfirm"
            @cancel="onDialogCancel"
    />
    <App/>
  </view>
</template>
<script>
import Dialog from './components/Dialog/index.vue';
import { baseConfig } from '@/api/config/index.js';
import { getAppId } from '@/utils/compatible';

// #ifdef MP-WEIXIN
const PlayerManager = require('./wxcomponents/playerManager.js');
const plugin = requirePlugin('playlet-plugin');
// #endif

export default {
  data() {
    return {
      dialogVisible: false,
      dialogOptions: {
        title: '',
        content: ''
      },
      resolvePromise: null,
      rejectPromise: null
    };
  },
  components: {
    Dialog
  },

  async onLaunch(options) {
    const miniAppId = getAppId();
    const systemInfo = uni.getSystemInfoSync();
    const platformMap = {
      'mp-toutiao': 'TIKTOK_MINI_APP',
      'mp-weixin': 'WEIXIN_MINI_APP'
    };
    // const { code, data } = await baseConfig({ miniAppId, platform: platformMap[systemInfo.uniPlatform] });
    // if (code === 0) {
    // 	this.$store.dispatch('$app/getConfig', data);
    // }
    if (uni.getSystemInfoSync().uniPlatform === 'mp-weixin') {
      // 注册播放器页面的onLoad事件
      plugin.onPageLoad(this._onPlayerLoad.bind(this));
    }
  },
  onShow: async function () {
    //设置常用起始时间
    console.log('---------------app onShow---------------------');
    this.$store.commit('$app/setCacheDiscountStamp');
  },
  onHide: function () {
    console.log('App Hide');
    this.$store.commit('$app/cacheDiscountStamp');
  },
  methods: {
    handleShowDiscount() {},
    async _onPlayerLoad(info) {
      const playerManager = new PlayerManager();
      playerManager._onPlayerLoad(info);
    },

    // 用来显示自定义弹窗
    showModal(options) {
      this.dialogOptions = options;
      this.dialogVisible = true;

      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    // 处理弹窗确认
    onDialogConfirm() {
      this.dialogVisible = false;
      if (this.resolvePromise) {
        this.resolvePromise({ confirm: true, cancel: false });
      }
    },
    // 处理弹窗取消
    onDialogCancel() {
      this.dialogVisible = false;
      if (this.rejectPromise) {
        this.rejectPromise({ confirm: false, cancel: true });
      }
    }
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
// @import "./uni_modules/vk-uview-ui/index.scss";
@import './common/css/app.scss';
@import './common/css/index.scss';
@import './uni_modules/uview-ui/index.scss';
</style>
