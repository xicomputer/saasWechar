
const app = getApp()
const formate = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],  //评论列表
    pageCurr:1,
    stopLoad:false,
    marchantId: 0,
    status:1,
    isSubscribe:0,   // 是否订阅
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      marchantId:options.marchantId,
      status:options.status
    })
    await this.getCommunityList()
    wx.hideLoading()
  },
   // 点赞/取消
   operationPraise(e){
    const {id,idx} = e.currentTarget.dataset
    let data = {commentId:id}
    return app.sjrequest('/marchant/operationPraise',data).then(res=>{
      let isPraise = 'commentList['+idx+'].isPraise'
      let praise = 'commentList['+idx+'].praise'
      if(this.data.commentList[idx].isPraise){
        this.setData({
          [isPraise]:0,
          [praise]:this.data.commentList[idx].praise - 1
        })
      }else{
        this.setData({
          [isPraise]:1,
          [praise]:this.data.commentList[idx].praise + 1
        })
      }
    })
  },
  // 获取订阅通知列表
  getCommunityList(){
    let data = {marchantId:this.data.marchantId,pageCurr:this.data.pageCurr,pageSize:10,stick:1,isMarchant:1}
    return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
      if(res.data.code == 200){
        res.data.data.forEach(item=>{
          item.addTime = formate.formatTime(item.addTime)
        })
        this.setData({
          pageCurr: this.data.pageCurr + 1,
          isSubscribe:res.data.data[0].userInfo.subscribe,
          commentList:[...this.data.commentList,...res.data.data]
        })
        if(res.data.data.length<10){
          this.setData({
            stopLoad: true
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  showDingYue(){
    // 获取用户信息
    var that = this
    let appid = wx.getStorageSync('appid')
    let data = {
        authorizerAppid:appid,
        sceneType:4
    }
    app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
      let tempData = res.data.data
      wx.requestSubscribeMessage({
          tmplIds: tempData,
          success: function (res) {
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
                          appId:appid,
                          targetType:5
                      }
                      app.sjrequest('/basic/addsubscription', data).then(res => {
                          if (res.data.code == 200) {
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
  toBuy(e){
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' +  e.currentTarget.dataset.id,
    })
  },
  // 跳转详情
  toDetail(e){
    let item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/Index/dynamic/storeDynamicDetails/storeDynamicDetails?item=' + encodeURIComponent(item),
    })
  },
  // 跳转商品详情
  toGoodsDetail(e){
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: `/pages/Index/GoodsDetails/GoodsDetails?id=${item.id}&sid=${item.tempSpecId}`,
    })
  },
  /**图片预览 */
  imgClick(e){
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  //  跳转到店铺
  toStore(){
    var that = this
    if(this.data.isSubscribe == 0){   // 如果未订阅的状态
      wx.requestSubscribeMessage({
        tmplIds: [app.globalData.sj_publish_article],
        success: function(res){ 
          if(res['jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'] == 'accept'){
            let data = {status:that.data.status,marchantId:that.data.marchantId,templateIds:'jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'}
            app.sjrequest('/basic/addsubscription',data).then(res=>{
              if(res.data.code == 200) {
                wx.showToast({
                  title: '订阅消息成功',
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
              }
            })
          }
        },
        fail(e){
          console.log(e)
          wx.showToast({
            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
            icon:'none'
          })
        },
        complete(){
          wx.navigateTo({
            url: '/pages/shopHome/home/home?marchantId=' + that.data.marchantId,
          })
        }
      })
    }else{ // 已订阅的状态
      wx.navigateTo({
        url: '/pages/shopHome/home/home?marchantId=' + that.data.marchantId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    wx.showLoading({
      title: '刷新中',
      })
      this.setData({
        commentList:[],
        pageCurr:1,
        stopLoad:false,
      })
      await this.getCommunityList()
      wx.stopPullDownRefresh()
      setTimeout(function(){wx.hideLoading({success(){
          wx.showToast({
            title: '刷新成功',
          })
      }})},500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.stopLoad){
      this.getCommunityList()
    }
  },

  /**
   * 用户点击右上角分享
   */
})