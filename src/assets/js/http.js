import axios from 'axios'
// import { Loading } from 'element-ui';
import { Toast } from 'vant';
import { debuglog } from 'util';
const METHOD = {
  GET: 'get',
  POST: 'post'
}

// 服务器测试路径 
var firstUrl = '/wxcss2'
// var firstUrl = ''


axios.interceptors.request.use(
  config => {
    let n = window.location.hash.indexOf('?')
    if (n !== -1) {
      config.headers.url = window.location.hash.substring(0, n)
    } else {
      config.headers.url = window.location.hash
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          Toast({
            message: '请求错误',
            position: 'middle',
            duration: 2000
          })
          break

        case 401:
          Toast({
            message: '未授权，请登录',
            position: 'middle',
            duration: 2000
          })
          break

        case 403:
          Toast({
            // message: '拒绝访问',
            message:'网络错误，请稍后重试',
            position: 'middle',
            duration: 2000
          })
          break

        case 404:
          Toast({
            message: `请求地址出错: ${err.response.config.url}`,
            position: 'middle',
            duration: 2000
          })
          break

        case 408:
          Toast({
            message: '请求超时',
            position: 'middle',
            duration: 2000
          })
          break

        case 500:
          Toast({
            message: '服务器内部错误',
            position: 'middle',
            duration: 2000
          })
          break

        case 501:
          Toast({
            message: '服务未实现',
            position: 'middle',
            duration: 2000
          })
          break

        case 502:
          Toast({
            message: '网管错误',
            position: 'middle',
            duration: 2000
          })
          break

        case 503:
          Toast({
            message: '服务不可用',
            position: 'middle',
            duration: 2000
          })
          break

        case 504:
          Toast({
            message: '网关超时',
            position: 'middle',
            duration: 2000
          })
          break

        case 505:
          Toast({
            message: 'HTTP版本不受支持',
            position: 'middle',
            duration: 2000
          })
          break

        default:
          Toast({
            message: '未知错误',
            position: 'middle',
            duration: 2000
          })
      }
    }
    return Promise.reject(err)
  });
export default {
  getUrl() {
    return firstUrl;
  },
  fetch(myConfig) {
    // Toast.allowMultiple()
    if (myConfig.apiUrl != '/myWater/getInvoicePdf' || myConfig.params.data.type == 'kabao') {
      
      Toast.loading({
        // mask: true,
        message: '加载中...',
        forbidClick: false,
        duration: 0,
        // overlay:true,
        // duration: 20000
        // icon: 'http://img.zcool.cn/community/01c2ff5be4332aa801209252f7fc4e.gif'
      })
    }
    
    if (window.location.href.indexOf('token') > -1) {
      localStorage.setItem('token', this.getUrlCode().token)
      let RequestObj = {
        // url:'/wxcss2/common/getUserInfo',// 打包地址
        url: firstUrl + '/common/getUserInfo',
        method: 'post',
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
        // onUploadProgress: progressEvent => {
        //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        //   Toast({
        //     message: '正在加载 ' + complete,
        //     position: 'middle',
        //     duration: 2000
        //   })
        // },
        withCredentials: true,
        data: {
          data: {},
          token: this.getUrlCode().token
        }
      };
      axios.defaults.baseURL = $baseUrl
      return new Promise((resolve, reject) => {
        axios(RequestObj).then(res => {
          if (res.status === 200) {
            if (res.data.code == 0) {
              // localStorage.setItem('token', res.data.data.token)
              localStorage.setItem('openId', res.data.data.openId)
              localStorage.setItem('headImgUrl', res.data.data.headImgUrl)
              localStorage.setItem('nickname', res.data.data.nickname)
              localStorage.setItem('bwcList', JSON.stringify(res.data.data.bwcList))
            } else if (res.data.code === 10001) {
              this.getCode()
            }



            let defaultConfig = {
              apiUrl: 'interface',
              method: METHOD.POST,
              params: null,
              isJson: true,
              needErrorCallback: true,
            }
            myConfig = Object.assign({}, defaultConfig, myConfig)
            myConfig.params.token = localStorage.getItem('token');
            if ('openId' in myConfig.params.data) {
              myConfig.params.data.openId = localStorage.getItem('openId');
            }

            axios.defaults.baseURL = $baseUrl
            let RequestObj = {
              url: firstUrl + myConfig.apiUrl,
              method: myConfig.method,
              timeout: 60000,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              // onUploadProgress: progressEvent => {
              //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
              //   Toast({
              //     message: '正在加载 ' + complete,
              //     position: 'middle',
              //     duration: 2000
              //   })
              // },
              withCredentials: true
            };
            // 数据格式处理
            if (myConfig.method === METHOD.GET) {
              RequestObj.params = myConfig.params;
            } else if (myConfig.method === METHOD.POST) {
              if (myConfig.isJson) {
                // json格式
                RequestObj.headers['Content-Type'] = 'application/json;charset=UTF-8'
                RequestObj.data = myConfig.params
              } else {
                // 默认表单格式
                RequestObj.params = myConfig.params
              }
            }
            let n = window.location.host.search(':')
            let str = window.location.host + ""
            let host = str.slice(0, n)

            // let host = "jc.uat.gdhwater.com"
            if (host === '127.0.0.1')
              host = 'localhost'
            // return new Promise((resolve ,reject)=>{
            axios(RequestObj).then(res => {
              Toast.clear();
              if (res.status === 200) {
                if (res.data.code === 10000) {

                } else if (res.data.code === 10001) {
                  this.getCode()

                }
                if (res.data.code !== 0) {
                  if (res.data.code !== 10001) {
                    console.log(res.data.code,myConfig.apiUrl);
                    console.log(res.data.code == 10017 && myConfig.apiUrl == '/myWater/dayFluxQuery.api');
                    if (res.data.code == 10017 && (myConfig.apiUrl == '/myWater/waterLoseQuery.api'|| myConfig.apiUrl == '/myWater/dayFluxQuery.api')) {
                      return
                    }
                    // if (res.data.code == 10017 && myConfig.apiUrl == '/myWater/dayFluxQuery.api'){ 
                    //   return
                    // }
                    if (myConfig.apiUrl != '/myWater/getInvoicePdf') {
                      Toast({
                        message: res.data.description,
                        position: 'middle',
                        duration: 2000
                      })
                    }
                    
                  }
                  if (myConfig.needErrorCallback) {
                    reject(res.data);
                  }

                } else {
                  resolve(res.data.data);
                }
              }
            }, err => {
              Toast.clear();
              if (myConfig.needErrorCallback) {
                reject(err)
              }
              // })
              //   .catch(error => {
              //   // loading.close();
              //   if (myConfig.needErrorCallback){
              //     reject(error)
              //   }
              // })
            })
          }
        }).catch(error => {
        })
      })

    } else {
      let defaultConfig = {
        apiUrl: 'interface',
        method: METHOD.POST,
        params: null,
        isJson: true,
        needErrorCallback: true,
      }
      myConfig = Object.assign({}, defaultConfig, myConfig)

      // if (!localStorage.getItem('token')) {
      //   localStorage.setItem('token', '1')
      // }
      myConfig.params.token = localStorage.getItem('token');
      // myConfig.params.token = '666';
      axios.defaults.baseURL = $baseUrl
      let RequestObj = {
        url: firstUrl + myConfig.apiUrl,
        method: myConfig.method,
        timeout: 60000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // onUploadProgress: progressEvent => {
        //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        //   console.log(complete);
        //   Toast({
        //     message: '正在加载 ' + complete,
        //     position: 'middle',
        //     duration: 2000
        //   })
        // },
        withCredentials: true,
      };
      // 数据格式处理
      if (myConfig.method === METHOD.GET) {
        RequestObj.params = myConfig.params;
      } else if (myConfig.method === METHOD.POST) {
        if (myConfig.isJson) {
          // json格式
          RequestObj.headers['Content-Type'] = 'application/json;charset=UTF-8'
          RequestObj.data = myConfig.params
        } else {
          // 默认表单格式
          RequestObj.params = myConfig.params
        }
      }
      let n = window.location.host.search(':')
      let str = window.location.host + ""
      let host = str.slice(0, n)

      // let host = "jc.uat.gdhwater.com"
      if (host === '127.0.0.1')
        host = 'localhost'
      return new Promise((resolve, reject) => {
        axios(RequestObj).then(res => {
          Toast.clear()
          if (res.status === 200) {
            if (res.data.code === 10000) {

            } else if (res.data.code === 10001) {
              this.getCode()

            }
            if (res.data.code !== 0) {
              if (res.data.code !== 10001) {
                // 这两个接口不显示报错信息
                if (myConfig.apiUrl != '/myWater/getInvoicePdf' && myConfig.apiUrl != '/myWater/waterLoseQuery.api') {
                  Toast({
                    message: res.data.description,
                    position: 'middle',
                    duration: 2000
                  })
                }
              }

              if (myConfig.needErrorCallback) {
                reject(res.data);
              }

            } else {
              resolve(res.data.data);
            }
          }
        }, err => {
          // loading.close();

          if (myConfig.needErrorCallback) {
            reject(err)
          }
        }).catch(error => {
          // loading.close();
          if (myConfig.needErrorCallback) {
            reject(error)
          }
        })
      })
    }

  },
  getCode() { // 非静默授权，第一次有弹框
    // this.code = ''
    // var local = window.location.href // 获取页面url
    // // var appid = 'wx81896e93452fb338' //yjh
    // var appid = 'wx20f832978d79a938' //myg
    // // var appid = 'wx9bd4a1def0ba9b9f'//xhy
    // this.code = this.getUrlCode().code // 截取code
    // if (this.code == null || this.code === '') { // 如果没有code，则去请求
    //     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect`
    // } else {
    //   // 你自己的业务逻辑
    // }



    let RequestObj = {
      url: firstUrl + '/common/wxUserInfo',
      method: 'post',
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: {
        data: window.location.href
      }
    };
    axios.defaults.baseURL = $baseUrl
    return new Promise((resolve, reject) => {
      axios(RequestObj).then(res => {
        if (res.status === 200) {
          if (res.data.code == 0) {
            window.location.href = res.data.data
          }
        }
      }).catch(error => {
        // alert(error)
      })
    })
  },
  getUrlCode() { // 截取url中的code方法
    var url = location.search
    this.winUrl = url
    var theRequest = new Object()
    if (url.indexOf("?") != -1) {
      var str = url.substr(1)
      var strs = str.split("&")
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
      }
    }
    return theRequest
  },
  getNewToken(myConfig) {
    let RequestObj = {
      url: '/common/getUserInfo',
      method: 'post',
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: {
        data: this.getUrlCode().code
      }
    };
    axios.defaults.baseURL = $baseUrl
    axios(RequestObj).then(res => {
      // alert(res.data.data)
      if (res.status === 200) {
        // localStorage.setItem('token', res.data.data)
        let defaultConfig = {
          apiUrl: 'interface',
          method: METHOD.POST,
          params: null,
          isJson: true,
          needErrorCallback: true,
        }
        myConfig = Object.assign({}, defaultConfig, myConfig)
        myConfig.params.token = res.data.data.token;
        axios.defaults.baseURL = $baseUrl
        let RequestObj = {
          url: firstUrl + myConfig.apiUrl,
          method: myConfig.method,
          timeout: 60000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true
        };
        // 数据格式处理
        if (myConfig.method === METHOD.GET) {
          RequestObj.params = myConfig.params;
        } else if (myConfig.method === METHOD.POST) {
          if (myConfig.isJson) {
            // json格式
            RequestObj.headers['Content-Type'] = 'application/json;charset=UTF-8'
            RequestObj.data = myConfig.params
          } else {
            // 默认表单格式
            RequestObj.params = myConfig.params
          }
        }
        let n = window.location.host.search(':')
        let str = window.location.host + ""
        let host = str.slice(0, n)

        // let host = "jc.uat.gdhwater.com"
        if (host === '127.0.0.1')
          host = 'localhost'
        return new Promise((resolve, reject) => {
          axios(RequestObj).then(res => {
            Toast.clear();
            if (res.status === 200) {
              if (res.data.code === 10000) {

              }
              if (res.data.code !== 0) {
                if (res.data.code !== 10001) {
                  if (myConfig.apiUrl != '/myWater/getInvoicePdf') {
                    Toast({
                      message: res.data.description,
                      position: 'middle',
                      duration: 2000
                    })
                  }
                }

                if (myConfig.needErrorCallback) {
                  reject(res.data);
                }

              } else {
                resolve(res.data.data);
              }

            }
          }, err => {
            if (myConfig.needErrorCallback) {
              reject(err)
            }
          }).catch(error => {
            if (myConfig.needErrorCallback) {
              reject(error)
            }
          })
        })
      }
    }).catch(error => {
      alert(error)
    })
  }
}