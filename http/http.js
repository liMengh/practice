const axios = require('axios')
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据
import {Message} from 'element-ui'
import store from '../../store/index'
import router from '@/router'
import { getToken} from '../../utils/auth' // get token from cookie

export let baseURL = "";
// 环境的切换
if (process.env.NODE_ENV === 'development') {
  //axios.defaults.baseURL = '/api'
   baseURL = "http://39.96.57.26:8063"
} else if (process.env.NODE_ENV === 'debug') {
  //axios.defaults.baseURL = '/'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = "https://saas.marstech.com/push"
}
// if (location.hostname === 'localhost') {
//   //axios.defaults.baseURL = ''
// } else if (location.hostname === '127.0.0.1') {
//   //console.log(location.hostname)
//   //axios.defaults.baseURL = ''
//   //console.log(axios.defaults.baseURL)
// } else if (location.hostname === '192.168.200.118') {
//   axios.defaults.baseURL = process.env.API_PATH_LOCAl
// } else if (location.hostname === 'test.marstech.com') {
//   axios.defaults.baseURL = process.env.API_PATH_TEST
// } else if (location.hostname === 'pre.marstech.com') {
//   axios.defaults.baseURL = process.env.API_PATH_PRE
// }else if(location.hostname  === 'api.marstech.com'){
//   axios.defaults.baseURL = process.env.API_PATH_PROD
// }

let yapiHttp = axios.create({
  baseURL: 'http://39.96.57.26:8082/',
  timeout: 15000,
  withCredentials: true
})
// 请求超时时间
axios.defaults.timeout = 1500000

// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
// import store from '@/store/index'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    //const token = store.state.token
    //token && (config.headers.Authorization = token)
    // 设置Content-Type
    config.headers['MARS-SOURCE'] = 'mars-web'
    config.headers['MARS-TICKET'] = getToken("MARS-TICKET") || ""
    return config
  },
  error => {
    return Promise.error(error)
  })

// 响应拦截器
axios.interceptors.response.use(
  response => {
    //console.log(response)
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.data.success !== undefined && !response.data.success && response.data.message){
      Message({
        type: "warning",
        message: response.data.message,
        duration: 1500,
        forbidClick: true
      })
    }

    if (response.status === 200) {
      // console.log(response.data.success)
      if (!response.data.success && response.data.message){
        Message({
          type: "warning",
          message: response.data.message,
          duration: 1500,
          forbidClick: true
        })
      }
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    console.log(error)
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Message({
            message: '登录过期，请重新登录',
            duration: 1000,
            forbidClick: true
          })
          // 清除token
          localStorage.removeItem('token')
          store.commit('loginSuccess', null)
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
          }, 1000)
          break

        // 404请求不存在
        case 404:
          Message({
            message: '网络请求不存在',
            duration: 1500,
            forbidClick: true
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          Message({
            message: error.response.data.message,
            duration: 1500,
            forbidClick: true
          })
      }
      return Promise.reject(error.response)
    } else {
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
  }
)

export function getNewHost(url, params, options = {}) {
  options.params = params;
  return new Promise((resolve, reject) => {
    yapiHttp.get(url, options).then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error.data);
      throw err;
    });
  });
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params, options = {}) {
  options.params = params
  return new Promise((resolve, reject) => {
    axios.get(url, options).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
      throw err
    })
  })
}

export function remove(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
      throw err
    })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, config={}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function putParams(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function postFrom(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      data: JSON.stringify(params),
      // transformRequest: [function (data) {
      //   data = QS.stringify(data);
      //   console.log(data)
      //   return data;
      // }],
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function postParams(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function downLoadFile(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      params: params,
      responseType: 'blob'
    }).then(res => {
      console.log(JSON.stringify(res));
      resolve(res)
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
