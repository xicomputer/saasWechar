//app.js
import request from './utils/request.js'
import store from './store/index.js'

const ourl1 = 'https://xssj.letterbook.cn/xssj-third'; // 正式环境
// const ourl1='https://test.xssj.letterbook.cn/xssj-third'; // 测试环境 
// const ourl1 = 'http://192.168.2.174:1255/xssj-third'   // 直播测试环境

// const ourl2 = 'https://xssj.letterbook.cn/xssh' // 商户
const ourl2 = 'http://192.168.2.174:8084/xssh' // 商户
const ourl3 = 'https://xssj.letterbook.cn/thirdService'



//全局事件总线
class GlobalEvents {
  constructor() {
    this.events = {}
  }

  $on(eventName, callback) {
    this.events[eventName] = {
      name: eventName,
      fun: callback
    };
  }

  $emit(eventName, data) {
    var eventItem = this.events[eventName];
    eventItem.fun(data);
  }
}

App({
  globalEvent: new GlobalEvents(),
  request: request, //拍卖请求
  onLaunch: function (options) {
    console.log("scene:", options.scene)
    this.globalData.scene = options.scene
    // 新版本
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      if (updateManager) {
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showToast({
                title: '发现新的版本，将重新打开小程序',
                icon: 'none',
                duration: 1000
              })
              setTimeout(() => {
                updateManager.applyUpdate()
              }, 1000);
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              })
            })
          }
        })
      }
    }
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.getSystemInfo = res
        if (res.errMsg == "getSystemInfo:ok") {
          if (res.screenHeight != res.safeArea.bottom) {
            this.globalData.isAdapter = true
          }
        }
      }
    })

    //获取胶囊信息
    this.globalData.MenuButton = wx.getMenuButtonBoundingClientRect();

    //判断token过期
    if (wx.getStorageSync('token')) {
      let data = {
        sjToken: wx.getStorageSync('token')
      }
      this.sjrequest('/userRegister/queryAllToken', data, wx.getStorageSync('token')).then(res => {
        try {
          if (res.data.data.state == 0) {
            wx.clearStorage()
            wx.navigateTo({
              url: '/pages/shopHome/home/home',
            })
          }

          if (res.statusCode == 200 && res.data.code == 200) {
            wx.setStorage({
              key: 'marchant_number_key',
              data: res.data.data.marchantNumber
            })
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
  },

  onShow() {},

  store: store,
  globalData: {
    userInfo: null,
    sj_publish_article: 'jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo', //订阅文章更新通知
    sj_commodity_modify: "5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc", //商品更新通知
    sj_commodity_add: "7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI", // 商品上新通知
    sj_refund: 'Fo6Lv3ByfA8U2yFkLoRz3qpUA-WR_5kGmaRPvgKz-Eo', //退款结果通知
    sj_shipments: 'Frrj06BIXoVD_Tnivp2s2IjSOuR-JUe_IzBBR4ImBB4', //订单发货提醒
    sj_activity: 'kQ6BVoIFknkMw-Qs0ofFzqZKrk7kxPETCSYf64HWRHw', //新活动通知
    sj_order: 'CkBQIUccLZ7tt7k1ZMv9NZk2hfMY0LT23AzL2Tidv9Q', //订单支付成功通知
    appid: 'wxcad66233bce675b4', //appid需自己提供，此处的appid我随机编写
    secret: '7ddc2addea6172ba1346c226cafc99d5', //secret需自己提供，此处的secret我随机编写
    // 商品详情页选择地址需要的参数
    comefrom: '',
    options: {}, // 传的参数
    // 商品评论需要的参数
    marchantId: 0, //商家id
    homeId: 0, // 主页id
    commodityId: 0, //商品id
    commodityLogo: '', //商品图片
    commodityName: '', //商品名称
    orderUniqueId: '', //订单uid
    goodsCommentDetails: '', //商品评论详情
    // imgUrl: ourl1 + '/file/uploadSignFile', //图片地址上传
    imgUrl2: ourl1 + '/file/uploadFile', //图片地址上传
    activeStatuList: [],
    getSystemInfo: null, // 系统信息
    MenuButton: null, // 胶囊信息
    firstIn: true,
    isAdapter: false,
    userInfo: null,
    setInfo: {},
    scene: "",
    imgFlag: false
  },

  // 分销 post form-data
  //第一种状态的底部  
  fxrequest(url, data, fxToken) {
    let promise = new Promise((resolve, reject) => {
      // var fxToken = wx.getStorageSync('fxToken')
      wx.request({
        url: ourl + url,
        method: 'POST',
        "data": data,
        header: {
          fxToken: fxToken,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res.data);
          }
        }),
        fail: (res => {
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },

  // post form-data
  sjrequest(url, data) {
    
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: ourl1 + url,
        method: 'POST',
        "data": data,
        header: {
          token: token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res.data);
          }
        }),
        fail: (res => {
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },

  // post form-data
  mbrequest(url, data) {
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: ourl3 + url,
        method: 'POST',
        "data": data,
        header: {
          token: token,
          'content-type': 'application/json'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res.data);
          }
        }),
        fail: (res => {
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },

  // post form-data
  mb2request(url, data) {
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: ourl1 + url,
        method: 'POST',
        "data": data,
        header: {
          token: token,
          'content-type': 'application/json'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res.data);
          }
        }),
        fail: (res => {
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },

  // post form-data 商户
  shrequest(url, data) {
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: ourl2 + url,
        method: 'POST',
        "data": data,
        header: {
          token: token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            reject(res.data);
          }
        }),
        fail: (res => {
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },

  // post  json
  sjrequest1(url, data, token) {
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      wx.request({
        url: ourl1 + url,
        method: 'POST',
        "data": data,
        header: {
          token: token,
          'content-type': 'application/json;charset=UTF-8'
        },
        success: (res => {
          if (res.statusCode == 200) {
            resolve(res);
            if (res.data.code !== 0 && res.data.code !== 200) {
              var data = res.data;
              setTimeout(() => {
                wx.showToast({
                  title: data.info,
                  icon: 'none'
                });
              }, 400);
            }
          } else {
            reject(res.data);
            console.log(res.data, '报错信息')
          }
        }),
        fail: (res => {
          console.log(res, '错误信息')
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 1500
          })
          reject('网络出错');
        })
      })
    })
    return promise;
  },
  signInRequest(url, data) {
    let promise = new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
        wx.request({
            url: ourl1 + url,
            method: 'POST',
            data: data,
            header: {
                token: token,
                'content-type': 'application/json;charset=UTF-8',
            },
            success: (res) => {
                if (res.statusCode == 200) {
                    resolve(res)
                    if (res.data.code !== 0 && res.data.code !== 200) {
                        var data = res.data
                    }
                } else {
                    reject(res.data)
                }
            },
            fail: (res) => {
                console.log(res, '错误信息')
                wx.showToast({
                    title: '网络出错',
                    icon: 'none',
                    duration: 1500,
                })
                reject('网络出错')
            },
        })
    })
    return promise
},
  userLogin(flag) {
    console.log(flag,'987456')
    var that = this
    if (this.globalData.setInfo.merchantId && !flag) {
      return new Promise(function (resolve, reject) {
        resolve('true');
      })
    }
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          const accountInfo = wx.getAccountInfoSync();
          var appid = accountInfo.miniProgram.appId;
          
          if (res.code) {
            var code = res.code
            let data = {
              appid,
              code
            }
            that.sjrequest('/thirdWxLogin/code', data).then(res => {
              console.log(res, '登录信息22')
              if (res.statusCode == 200 && res.data.code == 200) {
                that.globalData.setInfo = res.data.data.setInfo;
                that.globalData.environment = res.data.data.environment;
                let users = {
                  userInfo: {
                    avatarUrl: res.data.data.headimgurl,
                    nickName: res.data.data.nickname
                  }
                }
                wx.setStorage({
                  data: res.data.data.setInfo.merchantId,
                  key: 'merchantId'
                });
                wx.setStorage({
                  data: res.data.data.orderSwitch,
                  key: 'orderSwitch'
                });
                wx.setStorage({
                  data: res.data.data.nickname,
                  key: 'userName'
                });
                wx.setStorage({
                  data: res.data.data.setInfo.openId,
                  key: 'thirdWxOpenId'
                });
                wx.setStorage({
                  key: 'openId1',
                  data: res.data.data.setInfo.openId
                })
                wx.setStorage({
                  data: res.data.data.setInfo.openId,
                  key: 'openId_1'
                });
                wx.setStorage({
                  data: res.data.data.setInfo.sessionKey,
                  key: 'sessionkey'
                });
                wx.setStorage({
                  data: res.data.data.setInfo.appId,
                  key: 'appid'
                });
                wx.setStorage({
                  key: 'wx_userinfo_key',
                  data: users
                })
                wx.setStorage({
                  key: 'res',
                  data: res
                });
                wx.setStorage({
                  key: 'zl_userInfo',
                  data: res
                });
                wx.setStorage({
                  key: 'zl_jwt',
                  data: res.data.data.jwt
                });
                wx.setStorage({
                  key: 'token',
                  data: res.data.data.token
                });
                resolve(res.data.data);
              } else {
                reject('获取用户失败')
              }
            })
          }
        },
        fail: err => {
          console.log(err, '登录错误信息')
          reject(err);
        }
      });
    })
  },

  authLogin(data) {
    app.sjrequest('/thirdWxLogin/auth', data).then(res => {
      console.log(res, 'auth')
      wx.hideLoading()
    })
  },

  // 图片上传
  //   requestUploadFile(url,data,fxToken){
  //     let promise = new Promise((resolve,reject) => {
  //         var fxToken = wx.getStorage('fxToken')
  //         wx.uploadFile({
  //             url: ourl + url, 
  //             filePath: data, //chooseImage上传的图片
  //             name: 'headImg',//需要传给后台的图片字段名称
  //             header: {
  //                 fxToken:fxToken, 
  //                 "Content-Type": "multipart/form-data", //form-data格式
  //                 'Accept': 'application/json', 
  //             },
  //             success:(res) => {
  //                 resolve(res);
  //             }
  //         })
  //     })
  //     return promise;
  //   }

  setIndex(ishide = 0) {
    let that = this
    if (ishide == 'page') {
      that.sjrequest('/marchant/operateConcerns', {
        type: 4
      }).then(res => {})
      return;
    }
    if (ishide == 'hide' || ishide == 0) {
      return new Promise((resolve, reject) => {
        that.sjrequest('/marchant/operateConcerns', {
          type: 4
        }).then(res => {
          if (res.data.code == 200 && res.data.data.isHome) {
            if (ishide) {
              resolve('ishide')
            } else {
              // wx.navigateTo({
              //   url: `/pages/shopHome/home/home?marchantId=${ res.data.data.isHome}`
              // })
            }
          }
        })
      })
    } else {
      if (ishide !== 'show') {
        that.sjrequest('/marchant/operateConcerns', {
          type: 4
        }).then(res => {

          if (res.data.code == 200 && res.data.data.isHome) {
            // wx.navigateTo({
            //   url: `/pages/shopHome/home/home?marchantId=${ res.data.data.isHome}`
            // })
          }
        })
      }
    }
  },

  padLeftZero(str) {
    return ("00" + str).substr(str.length);
  },

  formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : this.padLeftZero(str)
        );
      }
    }
    return fmt;
  },

  formatTime(date, tag = '/') {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    let t1
    let t2 = [hour, minute, second].map(this.formatNumber).join(':')
    if (tag == '月') {
      t1 = [month, day].map(this.formatNumber).join(tag)
    } else {
      t1 = [year, month, day].map(this.formatNumber).join(tag)
    }

    if (tag == '小时') {
      t2 = [hour].map(this.formatNumber).join(':')
      return `${t2}`
    }

    return `${t1} ${t2}`
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  getLastDayTime(day) {
    return new Date().getTime() + day * 24 * 3600 * 1000;
  },
  cdebounce(func, delay, immediate) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;

      if (timer) clearTimeout(timer);
      if (immediate) {
        var doNow = !timer;
        timer = setTimeout(function () {
          timer = null;
        }, delay);
        if (doNow) {
          func.apply(context, args);
        }
      } else {

        timer = setTimeout(function () {
          func.apply(context, args);
        }, delay);
      }
    }
  }
  // end app.js
})