// pages/GoodsDetails/GoodsDetails.js
const time = require("../../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {}, // 详情数据
    DefaultSpec: {}, // 默认规格 
    NickFlag: false,
    normsIndex: 0, //默认索引
    goodsCommentList: [], //评论列表
    buyNum: 1,
    personnel: '', // 分销标识
    saleState: '无优惠', //优惠状态
    shipping: {}, // 地址 
    recommendGoodsList: [], // 为你推荐
    openOverlay: false,
    isClose: false, // 是否关店
    index: 1,
    status: 1,
    activityId: 0, // 小店id
    scene: {},
    agentUserId: '',
    tempSpecId: 0,
    showShare: false,
    showCountDown: false, // 是否限时抢购
    isEnd: false,
    buton: false, // 是否登录
    fromShop: false, // 是否从小店进入
    isShare: false, // 是否分享进入
    salesUserId: 0,
    showSale: false,
    showSpec: false,
    showXS: false,
    isLike: false,
    receivedSale: true, //是否领取了优惠券
    goodsId: -1,
    marchantId: 0,
    orderType: 0,
    saleCanList: [],
    haveToStore: false,
    haveWuliu: false,
    haveTongCheng: false,
    specType: 0, // 1 规格  2 购物车  3 立即购买
    reserve: "",
    city: "",
    formpage: '',
    nocityFlag: false,
    orderSwitch: null,
    memberShow: 0,
    appWidth: 0,
    shopInfo: {},

    codeUserInfo: {}, //code接口返回的用户信息
    userPhone: '', //用户手机号

    showHideStyle: '', //控制浏览用户显示隐藏样式 'show-bur'显示 'hide-bur'隐藏
    subscriptIndex: 0, //
    browseUser: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    setTimeout(() => {
      this.queryBrowseUser();
    }, 4000); //获取浏览用户

    this.setData({
      memberShow: options.memberShow
    })

    if (options.city != "" || options.reserve != "") {
      this.setData({
        city: options.city,
        reserve: options.reserve
      })
    }
    this.setData({
      activityId: options.activityId
    })

    if (app.globalData.scene == "1154") { //朋友圈链接进入
      app.globalData.options = options
      if (options.scene) { // 小程序码
        const scene = decodeURIComponent(options.scene)
        await this.getCodeParams(scene)
      } else { //  正常跳转
        this.setData({
          isShare: options.isShare ? true : false,
          goodsId: options.id || '', //商品id
          tempSpecId: options.sid || '', //规格id
          agentUserId: options.agentUserId || '',
          personnel: options.pid || '', //分销id
        });
      }

      //查看是否授权
      var that = this
      wx.getSetting({
        success: function (res) {
          if (wx.getStorageSync('wx_userinfo_key')) {
            if (wx.getStorageSync('token')) {
              that.setData({
                buton: true
              })
            }
          } else { // 没有授权
            that.setData({
              buton: false
            });
          }
        }
      });
      setTimeout(() => {
        that.getParams()
      }, 200);
    } else {
      app.userLogin().then(async (res) => {
        res = res || {};
        console.log('商品详情登录信息：', res);
        if (res !== 'true') {
          this.setData({
            NickFlag: !(res.nickname || res.headimgurl), //用户昵称和头像都没有的话需要授权
            userPhone: res.phoneNumber
          });
        }

        app.globalData.options = options
        if (options.scene) { // 小程序码
          const scene = decodeURIComponent(options.scene)
          await this.getCodeParams(scene)
        } else { //  正常跳转
          this.setData({
            isShare: options.isShare ? true : false, // 是否分享进入
            goodsId: options.id || '', //商品id
            tempSpecId: options.sid || '', //规格id
            agentUserId: options.agentUserId || '',
            personnel: options.pid || '', //分销id
          });
        }

        //查看是否授权
        var that = this
        wx.getSetting({
          success: function (res) {
            if (wx.getStorageSync('wx_userinfo_key')) {
              if (wx.getStorageSync('token')) {
                that.setData({
                  buton: true
                })
              }
            } else { // 没有授权
              that.setData({
                buton: false
              })
            }
          }
        });
        setTimeout(() => {
          that.getParams()
        }, 200);
      })
    }
    this.setData({
      appWidth: app.globalData.getSystemInfo.screenWidth
    })
  },

  showDingYue() {
    var that = this
    let appid = wx.getStorageSync('appid')
    let data = {
      authorizerAppid: appid,
      sceneTypes: [5, 6]
    }
    app.mb2request('/subTemplate/listPriTemplateId', data).then(res => {
      let tempData = res.data.data
      wx.requestSubscribeMessage({
        tmplIds: tempData,
        success: (res) => {
          wx.getSetting({
            withSubscriptions: true,
            success: result => {
              wx.showToast({
                title: '订阅消息成功',
              })
              let data = {
                status: that.data.status,
                marchantId: that.data.marchantId,
                templateIds: tempData,
                appId: appid,
                targetType: 1,
                targetId: that.data.goodsId
              }
              app.sjrequest('/basic/addsubscription', data).then(res => {
                if (res.data.code == 200) {
                  that.getParams()
                  wx.showToast({
                    title: '订阅消息成功',
                  })
                  this.triggerEvent('event', true)
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              })
            }
          })
        },
        fail(e) {
          console.log(e)
          wx.showToast({
            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
            icon: 'none'
          })
        }
      })
    })
  },
  //是否从小程序码进来
  getCodeParams(id) {
    let data = {
      id: id
    }
    let that = this
    return app.sjrequest('/marchant/queryIdentifica', data).then(res => {
      if (res.data.code == 200) {
        that.setData({
          scene: JSON.parse(res.data.data.scene),
          goodsId: JSON.parse(res.data.data.scene).id,
          isShare: true
        })
        if (that.data.scene.pid) {
          that.setData({
            personnel: that.data.scene.pid
          })
        }
        if (that.data.scene.sid) {
          that.setData({
            tempSpecId: that.data.scene.sid
          })
        }
        // if(that.data.scene.form == 'store'){  // 来自小店
        //   this.setData({
        //     fromShop:true,
        //     activityId:that.data.scene.activityId,
        //     salesUserId:that.data.scene.salesUserId
        //   })
        // }
      }
    })
  },

  async getParams() {
    console.log(this.data.goodsId)
    let data = {
      commodityId: this.data.goodsId
    }
    this.data.activityId && (data.activityId = this.data.activityId);
    var that = this;
    await app.sjrequest('/commodity/queryCommodityInfo', data).then(res => {
      if (res.data.code == 200) {
        var resultData = res.data.data;
        console.log(resultData, 'resultData')
        if (resultData.isShelves == 0) {
          this.setData({
            nocityFlag: true
          });
        }
        if (resultData.salesStoreCommodity) {
          if (resultData.salesStoreCommodity.countdown) {
            let time1 = time.formatTimeSec(resultData.salesStoreCommodity.countdown);
            resultData.salesStoreCommodity.countdown = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime();

            this.setData({
              showCountDown: true,
              isEnd: resultData.salesStoreCommodity.countdown <= 0
            });
          }
        }
        let orderType = resultData.marchant.businessModel.split(',').sort()
        orderType = orderType[0]
        this.setData({
          orderType: orderType
        })
        if (resultData.marchant.businessModel.indexOf(1) != -1) {
          this.setData({
            haveWuliu: true
          })
        }
        if (resultData.marchant.businessModel.indexOf(2) != -1) {
          this.setData({
            haveTongCheng: true
          })
        }
        if (resultData.marchant.businessModel.indexOf(3) != -1) {
          this.setData({
            haveToStore: true
          })
        }

        resultData.skuList.forEach((item, index) => {
          if (item.stock == -1) {
            item.stock = '有货'
          }
          if (item.isDefault == 1) {
            that.setData({
              DefaultSpec: item,
              normsIndex: index
            });
          }
          if (that.data.tempSpecId) {
            if (item.id == that.data.tempSpecId) {
              that.setData({
                DefaultSpec: item,
                normsIndex: index
              });
              return;
            }
          }
        });

        if (resultData.likeState == 0) {
          that.setData({
            isLike: true
          })
        }

        if (resultData.commentList.length) {
          resultData.commentList.forEach(item => {
            item.addTime = time.formatTime(item.addTime)
          });
        }
        if (resultData.commodityCouponsList.length) {
          resultData.commodityCouponsList.forEach(item => {
            item.endTime = time.formatTimeSec(item.endTime)
          })
        }

        that.setData({
          isEnd: resultData.remainingTime == 0,
          detailData: resultData,
          marchantId: resultData.marchantId,
          shipping: resultData.shipping || {},
          countTrolley: resultData.countTrolley,
          goodsCommentList: resultData.commentList,
          saleCanList: resultData.commodityCouponsList,
          orderSwitch: resultData.marchant.orderSwitch
        });

        if (that.data.saleCanList.length) {
          that.setData({
            saleState: '已领券'
          })
          that.data.saleCanList.forEach(item => {
            if (item.isDraw == 0) {
              that.setData({
                receivedSale: false,
                saleState: '可领券'
              });
            }
          })
        }
      } else if (res.data.code == 338) {
        this.setData({
          isClose: true
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      that.getLabelList()
    });

    if (!that.data.fromShop) {
      this.queryRecommendList()
      this.getShopInfo()
    }
  },

  queryRecommendList() {
    let data = {
      marchantId: this.data.detailData.marchantId,
      commodityId: this.data.detailData.commodityId
    }
    app.sjrequest('/commodity/queryRecommendList', data).then(res => {
      if (res.data.code == 200) {
        // if(res.data.data.length>4){
        //   res.data.data.splice(4)
        // }
        this.setData({
          recommendGoodsList: res.data.data
        })
        console.log("推荐", res.data.data)
      }
    });
  },
  noActivity() {
    wx.showToast({
      title: '暂无活动',
      icon: 'none'
    })
  },
  // 返回小店
  toStore() {
    wx.navigateTo({
      url: '/pages/smallShop/myShop/myShop?activityId=' + this.data.activityId,
    })
  },

  finishedCountDown() { // 倒计时结束
    this.setData({
      showCountDown: false,
      isEnd: true
    })
  },
  // 优惠弹框
  showSale() {
    if (this.data.detailData.commodityCouponsList.length) {
      this.setData({
        showSale: true
      });
    } else {
      wx.showToast({
        title: '暂无优惠',
        icon: 'none'
      });
    }
  },
  closeSale() {
    this.setData({
      showSale: false
    });
  },
  receiveSale() {
    if (this.data.receivedSale) {
      wx.showToast({
        title: '已领取优惠券',
        icon: none
      })
      return
    }
    var data = {
      couponsIds: []
    }
    this.data.saleCanList.forEach(item => {
      data.couponsIds.push(item.id)
    })
    data.couponsIds = data.couponsIds.toString()
    var token = wx.getStorageSync('token')
    app.sjrequest('/coupons/getCoupons', data, token).then(res => {
      if (res.data.code == 200) {
        this.data.saleCanList.forEach(item => {
          item.isDraw = 1
        })
        this.setData({
          showSale: false,
          saleState: '已领券',
          receivedSale: true,
          saleCanList: this.data.saleCanList
        })
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
      }
    })
  },
  receivedSale() {
    wx.showToast({
      title: '已经领取过了',
      icon: 'none'
    })
    this.setData({
      showSale: false
    })
  },
  // 评论列表
  goCommentList() {
    wx.navigateTo({
      url: '/pages/order/goodsCommentList/goodsCommentList?commodityId=' + this.data.goodsId,
    })
  },
  // 放大图片
  zoomImg(e) {
    const {
      src,
      list
    } = e.currentTarget.dataset
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  // 评论
  toComment(e) {
    var item = e.currentTarget.dataset['item']
    app.globalData.goodsCommentDetails = item
    wx.navigateTo({
      url: '/pages/order/goodsCommentDetails/goodsCommentDetails'
    })
  },
  // 点赞
  liketap(e) {
    var id = e.currentTarget.dataset['id']
    var index = e.currentTarget.dataset['index']
    var data = {
      'commentId': id
    }
    app.sjrequest('/orderComment/operationPraise', data).then(res => {
      var list = this.data.goodsCommentList
      list[index].myPraise = !list[index].myPraise
      if (list[index].myPraise) {
        list[index].praise += 1;
      } else {
        list[index].praise -= 1;
      }
      this.setData({
        goodsCommentList: list
      })
    })
  },
  /* 运费*/
  findFreightStr() {
    let data = {
      commoditySkuId: this.data.DefaultSpec.id,
      province: this.data.shipping.provincesName
    }
    app.sjrequest('/commodity/findFreightStr', data).then(res => {
      if (res.data.code == 200) {
        let freightStr = 'DefaultSpec.freightStr'
        this.setData({
          [freightStr]: res.data.data.freightStr
        })
      }
    })
  },
  /**选择规格 */
  selectNorms(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.normsIndex) {
      return
    }
    this.setData({
      normsIndex: index,
      buyNum: 1,
      DefaultSpec: this.data.detailData.skuList[index]
    })
  },
  // 编辑数量
  handleEdit(e) {
    if (e.currentTarget.dataset.type === 'minus') {
      // 减一
      if (this.data.buyNum === 1) {
        wx.showToast({
          title: '数量不能少于1',
          icon: 'none'
        })
        return
      } else {
        this.setData({
          buyNum: this.data.buyNum - 1
        })
      }
    } else {
      // 加一
      this.setData({
        buyNum: this.data.buyNum + 1
      })
    }
  },
  /**立即购买 */
  doBuy() {
    if (this.data.buyNum > this.data.DefaultSpec.stock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        showSpec: false
      });
      return;
    }
    // if(!this.data.shipping.provincesName&&!this.data.haveToStore){
    //   this.selectAddress()
    //   return
    // }

    var {
      city,
      reserve
    } = this.data;
    let data = {
      marchantId: this.data.detailData.marchantId,
      orderType: city ? '2' : reserve ? '3' : '1',
      commoditys: [],
      shppingId: this.data.shipping.id || this.data.shipping.shippingId
    }
    data.commoditys.push({
      commodityId: this.data.detailData.commodityId,
      tempSpecId: this.data.DefaultSpec.id,
      amount: this.data.buyNum
    })
    wx.showLoading({
      title: '加载中...'
    });

    var token = wx.getStorageSync('token')
    app.sjrequest1('/order/onekeyAboutOrder', data, token).then(res => {
      if (res.data.code === 200) {
        wx.hideLoading()
        // 更新 store 数据
        app.store.setState({
          submitObj: JSON.stringify(res.data.data)
        })
        let orderType = this.data.city ? "&orderType=2" : this.data.reserve ? "&orderType=3" : "&orderType=1"
        console.log("city:", this.data.city)
        this.setData({
          showSpec: false
        })
        wx.navigateTo({
          url: `/pages/order/submitOrder/submitOrder?personnel=${this.data.personnel}&salesUserId=${this.data.salesUserId}&agentUserId=${this.data.agentUserId}&activityId=${this.data.activityId}` + orderType
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  /**查看商品详情 */
  showDetail(e) {
    const id = e.currentTarget.dataset.id
    let otherOrder = this.data.city ? "&city=1" : this.data.reserve ? "&reserve=1" : ""
    wx.navigateTo({
      url: '../GoodsDetails/GoodsDetails?id=' + id + otherOrder,
    })
  },
  //喜欢
  selectIsLike() {
    var state
    if (this.data.detailData.likeState == 0) {
      state = 1
    } else {
      state = 0
    }
    let data = {
      commodityId: this.data.detailData.commodityId,
      state: state
    }
    app.sjrequest('/commodity/like', data).then(res => {
      this.setData({
        isLike: !this.data.isLike
      })
    })
  },
  //获取标签列表
  getLabelList() {
    let data = {
      labelIntros: this.data.detailData.arrLabels
    }
    app.sjrequest('/commodity/queryLabelIntro', data).then(res => {
      console.log(res.data.data)
      this.setData({
        labelList: res.data.data
      })
    })
  },
  // 显示隐藏标签
  showLabel() {
    this.setData({
      showXS: true
    })
  },
  hideLabel() {
    this.setData({
      showXS: false
    })
  },
  // 分享显示隐藏
  showShare() {
    this.setData({
      showShare: true
    })
  },
  hideShare() {
    this.setData({
      showShare: false
    })
  },
  // 图片预览
  imgClick(e) {
    var that = this
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  // 跳转页面
  toIndex() {
    let that = this
    // + '&personnel=' + this.data.personnel
    wx.navigateTo({
      url: '/pages/shopHome/home/home?marchantId=' + this.data.detailData.marchantId,
    })
  },
  toCart() {
    wx.navigateTo({
      url: '../ShopCart/ShopCart',
    })
  },
  // 选择规格
  selectSpec(e) {
    if (this.data.detailData.remainingTime && !this.data.showCountDown) { //秒杀活动结束
      this.setData({
        isEnd: true
      });
      return;
    }

    if (e.currentTarget.dataset.type == "2" && this.data.reserve) {
      wx.showToast({
        title: '预订订单不可加入购物车',
        icon: "none"
      })
      return
    }
    if (e.currentTarget.dataset.type == "2" && this.data.city) {
      wx.showToast({
        title: '同城订单不可加入购物车',
        icon: "none"
      })
      return
    }
    this.setData({
      showSpec: true,
      specType: e.currentTarget.dataset.type
    })
  },

  onClose() {
    this.setData({
      showSpec: false
    })
  },
  // 跳转收货地址
  selectAddress() {
    app.globalData.comefrom = 'goodsDetail'
    wx.navigateTo({
      url: '/pages/Address/AddressList/AddressList'
    })
  },
  // 确认规格
  comfirmSpec() {
    if (this.data.specType == 2) {
      this.addCart()
    }
    if (this.data.specType == 3) {
      this.doBuy()
    }
  },
  /** 加入购物车 */
  addCart() {
    if (this.data.DefaultSpec.stock == 0) {
      wx.showToast({
        title: '暂无库存',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        showSpec: false
      })
      return
    }
    var data = {
      'tempSpecId': this.data.DefaultSpec.id,
      'commodityId': this.data.DefaultSpec.commodityId,
      'amount': this.data.buyNum,   // 购买数量
      'marchantId': this.data.detailData.marchantId,
      'operate': 1
    }
    app.sjrequest('/commodity/addTrolley', data).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        let ids = wx.getStorageSync('merchantId')
        app.sjrequest('/commodity/countTrolley', {
          marchantId: ids
        }).then(res => {
          this.setData({
            countTrolley: res.data.data.countTrolley,
            showSpec: false,
            buyNum: 1
          })
        })
      }
    })
  },
  // 客服
  // toKeFu(){
  //   wx.navigateTo({
  //     url: `/pages/order/contact/contact?logoPic=${this.data.detailData.marchant.logoPic}&marchantId=${this.data.detailData.marchantId}&marchantName=${this.data.detailData.marchant.nickName}`,
  //   })
  // },
  // toBack(){
  //   if(!this.data.detailData.subscribe){
  //     var that = this
  //       let appid = wx.getStorageSync('appid')
  //       let data = {
  //           authorizerAppid:appid,
  //           sceneType:1
  //       }
  //       app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
  //         debugger
  //           let tempData = res.data.data
  //           wx.requestSubscribeMessage({
  //               tmplIds: tempData,
  //               success: (res)=>{
  //                   wx.getSetting({
  //                       withSubscriptions: true,
  //                       success: result => {
  //                           wx.showToast({
  //                               title: '订阅消息成功',
  //                           })
  //                           let data = {
  //                               status: that.data.status,
  //                               marchantId: that.data.marchantId,
  //                               templateIds: tempData,
  //                               appId:appid
  //                           }
  //                           app.sjrequest('/basic/addsubscription', data).then(res => {
  //                               if (res.data.code == 200) {
  //                                   wx.showToast({
  //                                       title: '订阅消息成功',
  //                                   })
  //                                   this.triggerEvent && this.triggerEvent('event', true)
  //                               } else {
  //                                   wx.showToast({
  //                                       title: res.data.msg,
  //                                       icon: 'none'
  //                                   })
  //                               }
  //                           })
  //                       }
  //                   })
  //               },
  //               fail(e) {
  //                   console.log(e)
  //                   wx.showToast({
  //                       title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
  //                       icon: 'none'
  //                   })
  //               }
  //           })
  //       })
  //   }else{
  //     wx.navigateBack({
  //       delta: 0,
  //     })
  //   }


  //   var pages=getCurrentPages();
  //   var delta=0,bi=-1;
  //   for(var i=(pages.length-1);i>=0;i--){
  //     var pageItem=pages[i]; bi++;
  //     if(pageItem.route=='pages/shopHome/home/home'){
  //       delta=bi;
  //     }
  //   }

  //   if(delta){
  //     wx.navigateBack({delta});
  //   }else{
  //     // wx.navigateTo({
  //     //   url: '/pages/shopHome/home/home?marchantId=' + e.currentTarget.dataset.marchantid,
  //     // })
  //     wx.navigateTo({
  //       url: '/pages/shopHome/home/home',
  //     })
  //   }
  // },
  toBack() {
    wx.navigateTo({
      url: '/pages/shopHome/home/home',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'zl_userInfo',
      success: res => {
        var info = res.data;
        var phone = '';
        if (info.statusCode == 200 && info.data.code == 200) {
          phone = info.data.data.phoneNumber;
        }
        this.setData({
          codeUserInfo: info,
          userPhone: phone
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton(); //隐藏返回首页按钮
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.options = {}
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      showShare: false
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let orderType = this.data.city ? "&city=1" : this.data.reserve ? "&reserve=1" : ""
    let activityString = this.data.activityId ? '&activityId=' + this.data.activityId : '';
    let path = this.data.fromShop ? `/pages/Index/GoodsDetails/GoodsDetails?id=${this.data.goodsId}&sid=${this.data.tempSpecId}&salesUserId=${this.data.salesUserId}&pid=${this.data.personnel}&form=store&isShare=true` + `&orderSwitch=` + this.data.orderSwitch : `/pages/Index/GoodsDetails/GoodsDetails?id=${this.data.goodsId}&isShares=true` + `&orderSwitch=` + this.data.orderSwitch + orderType + `` + activityString;
    return {
      title: this.data.detailData.description,
      path,
    }
  },
  onShareTimeline: function () {
    let orderType = this.data.city ? "&city=1" : this.data.reserve ? "&reserve=1" : ""
    let activityString = this.data.activityId ? '&activityId=' + this.data.activityId : ''
    console.log("this.activityId:", this.data.activityId)
    return {
      title: this.data.detailData.description,
      query: this.data.fromShop ? `id=${this.data.goodsId}&sid=${this.data.tempSpecId}&salesUserId=${this.data.salesUserId}&pid=${this.data.personnel}&form=store&isShare=true` + activityString + `&orderSwitch=` + this.data.orderSwitch : `id=${this.data.goodsId}&isShares=true` + orderType + `&orderSwitch=` + this.data.orderSwitch + `` + activityString,
      imageUrl: this.data.detailData.imagList[0]
    }
  },
  closeBgNocity() {
    wx.redirectTo({
      url: '/pages/shopHome/home/home',
    })
  },

  bindGetUserInfo() { //拉起授权获取用户头像昵称信息
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取用户信息',
      complete: res => {
        if (res.encryptedData) {
          this.setData({
            isAuthorization: false
          });
          this.login(res); //同意授权
        } else {
          //拒绝授权
          setTimeout(() => {
            wx.showToast({
              title: '授权未成功',
              icon: 'none'
            });
          }, 1000);
        }
      },
    });
  },

  cancel() {
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2]
    wx.navigateBack({
      delta: 0,
      success: function () {
        beforePage.onLoad(app.globalData.options)
      }
    })
  },
  //登录
  login(userInfo) {
    var that = this;
    var encryptedData = userInfo.encryptedData;
    var iv = userInfo.iv;
    var openid = wx.getStorageSync('thirdWxOpenId');
    let appid = wx.getStorageSync('appid');
    let data = {
      appid,
      openid,
      encryptedData,
      iv
    }
    wx.showLoading({
      title: '加载中'
    });
    app.sjrequest('/thirdWxLogin/auth', data).then(res => {
      wx.hideLoading();
      that.cancel();
      if (res.statusCode == 200 && res.data.code == 200) {
        var data = res.data.data;
        var userInfo = {
          avatarUrl: data.headimgurl,
          nickName: data.nickname
        };
        wx.setStorage({
          key: 'wx_userinfo_key',
          data: {
            userInfo
          }
        });
      }
      that.setData({
        NickFlag: false
      });
    })
  },

  goBusinessInfo() {
    wx.navigateTo({
      url: '/pages/Index/BusinessInfo/BusinessInfo',
    })
  },

  getShopInfo() {
    let ids = this.data.detailData.marchantId
    app.sjrequest('/marchant/subjectInfo', {
      merchantId: ids
    }).then(res => {
      this.setData({
        shopInfo: res.data.data
      })
      console.log("res:", res)
    })
  },
  changeTime(e) {
    this.data.detailData.timeData = e.detail
    this.setData({
      detailData: this.data.detailData
    })
  },

  hideEndPopup() {
    this.setData({
      isEnd: false
    });
  },

  viewMoreActivity() {
    this.setData({
      isEnd: true
    });
    var activityShop = 'pages/Index/saleList/saleList';
    var pages = getCurrentPages();
    var len = pages.length;
    var delta = -1;
    var isHas = false;
    for (var i = (len - 1); i >= 0; i--) {
      var item = pages[i];
      delta++;
      if (item.route == activityShop) {
        isHas = true;
        break;
      }
    }
    setTimeout(() => {
      if (isHas) {
        wx.navigateBack({
          delta
        });
      } else {
        wx.redirectTo({
          url: '/' + activityShop
        });
      }
    }, 0);
  },

  getPhoneNumber(e) {
    var detail = e.detail;
    let appid = wx.getStorageSync('appid');
    var openid = wx.getStorageSync('thirdWxOpenId');
    if (detail.iv) {
      var {
        iv,
        encryptedData
      } = detail;
      app.sjrequest('/thirdWxLogin/deciphering', {
        appid,
        openid,
        iv,
        encryptedData
      }).then(res => {
        if (res.statusCode == 200 && res.data.code == 200) {
          var phone = res.data.data.phoneNumber;
          var info = this.data.codeUserInfo;
          if (info.data && info.data.data) {
            info.data.data.phoneNumber;
            wx.setStorage({
              key: 'zl_userInfo',
              data: info
            });
          }
          this.setData({
            userPhone: phone
          });
        }
      })
    }
  },


  queryBrowseUser() { //查询浏览用户
    var {
      marchantId,
      goodsId
    } = this.data;
    if (marchantId && goodsId) {
      app.sjrequest('/marchant/viewRecordList', {
        merchantId: this.data.marchantId,
        commodityId: this.data.goodsId,
      }).then(res => {
        if (res.statusCode == 200 && res.data.code == 200) {
          var list = res.data.data || [];
          this.setData({
            browseUser: list
          }, () => {
            this.showBrowseUser();
          });
        }
      }).catch(err => {})
    } else {
      setTimeout(() => {
        this.queryBrowseUser();
      }, 10000);
    }
  },

  _parseDate(str, resType) { //resType 取值 'object' | 'number'
    str = str || '';
    var a = str.split(/[^0-9]+/);
    var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
    return resType == 'number' ? date.getTime() : date;
  },

  _omputedDate(dateStr) { //计算事件发生距离当前的时间
    var createDate = this._parseDate(dateStr, 'number');
    var nowDate = new Date().getTime();
    var milliseconds = nowDate - createDate;
    var UNITS = {
      '年': 31557600000,
      '月': 2629800000,
      '天': 86400000,
      '小时': 3600000,
      '分钟': 60000,
      '秒': 1000
    }
    var humanize = '';
    for (var key in UNITS) {
      if (milliseconds >= UNITS[key]) {
        humanize = Math.floor(milliseconds / UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },

  showBrowseUser() { //展示浏览用户
    var subscriptIndex = this.data.subscriptIndex;
    var browseUser = this.data.browseUser;
    if (subscriptIndex == browseUser.length) {
      setTimeout(() => {
        this.setData({
          subscriptIndex: 0,
          browseUser: []
        }, () => {
          this.queryBrowseUser();
        });
      }, 30000);
    } else {
      var itemUser = browseUser[subscriptIndex];
      var humanize = this._omputedDate(itemUser.createTime);
      itemUser.humanize = humanize;
      this.setData({
        showHideStyle: 'show-bur',
        browseUser
      }, () => {
        setTimeout(() => {
          this.setData({
            showHideStyle: 'hide-bur'
          });
          setTimeout(() => {
            subscriptIndex += 1;
            this.setData({
              showHideStyle: '',
              subscriptIndex
            }, () => {
              setTimeout(() => {
                this.showBrowseUser();
              }, 1000);
            });
          }, 1000);
        }, 4000);
      });
    }
  },

  swiperChange(e) {
    var current = e.detail.current;
    var videoUrl = this.data.detailData.videoUrl;
    if (videoUrl) {
      var videoContext = wx.createVideoContext('swiperVideo');
      if (current == 0) {
        // videoContext.play();
      } else {
        videoContext.pause();
      }
    }
  }

})