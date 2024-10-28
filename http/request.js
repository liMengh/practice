import request from '../network/request.js'
import _config from './config.js'
import Vue from 'vue'

request.setConfig({
	baseUrl: _config.baseUrl,
	contentType: _config.contentType,
	business: '',
	debug: false
})
const urlArr = ['/web-service/tag/filterItems', '/web-service/union/exchangeToken',
	'/web-service/tag/photo', '/web-service/folder/list',
	'web-service/folder/delete', '/web-service/folder/photoList',
	'/web-service/folder/relation']
function urlCheck(url) {
	var some = urlArr.some((value) => url.indexOf(value) > -1)
	return some
}

// 请求拦截
request.interceptor.request = (config => {
	let token = uni.getStorageSync("token") || '';
	// if (token && !urlCheck(config.url)) {
	config.header['X-Dts-Token'] = `${token}`;
	config.header['token'] = `${token}`;
	config.header['version'] = `${_config.version}`;

	// }
	// if( urlCheck(config.url)){
	// 	config.header['X-Dts-Token'] = token
	// }
	if (config.type == 'form-data') {
		config.header['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
	} else if (config.method.toUpperCase() === 'POST') {
		config.header['Content-Type'] = 'application/json;charset=UTF-8'
	}

	// 添加一个自定义的参数，默认异常请求都弹出一个toast提示
	if (config.toastError === undefined) {
		config.toastError = true
	}

	return config;
})

// 全局的业务拦截
request.interceptor.response = ((res, config) => {
	if (res.errno === 0 || res.code == 'ARTUP-200') {
		res.success = true;
	} else if (res.errno === 501) {
		uni.removeStorageSync('token');
		uni.removeStorageSync('userInfo');
		uni.reLaunch({
			url: '/pages/index/index'
		})
		// Vue.prototype.$store.dispatch('user/wxLogin');
	} else if (res.errno === 507) {

    } else {
		return setTimeout(() => { // setTimeout处理了showToast和showLoading冲突的问题
			uni.showToast({
				title: res.errmsg,
				icon: "none",
				duration: 5000
			});
		}, 1000);
	}
	return res;
})


// 全局的错误异常处理
request.interceptor.fail = ((res, config) => {
	let ret = res;
	let msg = ''
	if (res.statusCode === 200) { // 业务错误
		msg = res.data.msg
		ret = res.data
	} else if (res.statusCode > 0) { // HTTP错误
		msg = '服务器异常[' + res.statusCode + ']'
	} else { // 其它错误
		msg = res.errMsg
	}
	if (config.toastError) {
		if (res.statusCode != 401) {
			uni.showToast({
				title: msg,
				duration: 2000,
				icon: 'none'
			})
		} else {
			// token失效，需要重新登录
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}
	}
	return ret;
})

export default request;
