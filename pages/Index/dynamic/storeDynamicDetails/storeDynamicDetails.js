const app = getApp()
const time = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicData:{},
    commentDataList:[],  // 评论列表
    content:'',
    isFocus:false,
    subscribe:0,
    hotelList:[],
    inputHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(options.isFocus){
      this.setData({isFocus:true})
    }
    await this.getCommunityList(options.id)
    this.getCommentInfo()
  },
  // 获取订阅通知列表
  getCommunityList(id){
    let data = {stick:3,commentId:id}
    return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
      if(res.data.code == 200){
        res.data.data[0].addTime = time.formatTime(res.data.data[0].addTime)
        if(res.data.data[0].marchantCorrelationList.length){
          var hotelList = []
          res.data.data[0].marchantCorrelationList.forEach(item=>{
            if(item.marchantCorrelation.source == 2){hotelList.push(item)}
          })
        }
        this.setData({
          dynamicData:res.data.data[0],
          subscribe:res.data.data[0].userInfo.subscribe,
          hotelList:hotelList
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
  // 点赞/取消
  operationPraise(){
    let data = {commentId:this.data.dynamicData.id}
    return app.sjrequest('/marchant/operationPraise',data).then(res=>{
      var pages = getCurrentPages()
      var prevPge = pages[pages.length-2]
      prevPge.data.commentList.forEach((item,idx)=>{   //更新上一个页面的内容
        let isPraise1 = 'commentList['+idx+'].isPraise'
        let praise1 = 'commentList['+idx+'].praise'
        if(item.id == this.data.dynamicData.id){
          if(item.isPraise){
            prevPge.setData({
              [isPraise1]:0,
              [praise1]:this.data.dynamicData.praise - 1
            })
          }else{
            prevPge.setData({
              [isPraise1]:1,
              [praise1]:this.data.dynamicData.praise + 1
            })
          }
        }
      })
      let isPraise = 'dynamicData.isPraise'
      let praise = 'dynamicData.praise'
      if(this.data.dynamicData.isPraise){
        this.setData({
          [isPraise]:0,
          [praise]:this.data.dynamicData.praise - 1
        })
      }else{
        this.setData({
          [isPraise]:1,
          [praise]:this.data.dynamicData.praise + 1
        })
      }
      
    })
  },
  // 获取评论信息
  getCommentInfo(){
    let data = {commentId:this.data.dynamicData.id}
    return app.sjrequest('/marchant/queryMarchantCommentReply',data).then(res=>{
      if(res.data.code == 200) {
        res.data.data.forEach(item=>{
          item.addTime = time.formatTime(item.addTime)
        })
        this.setData({commentDataList:res.data.data})
      }
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
  // 输入文字
  inputContent(e){
    this.setData({
      content:e.detail.value.trim()
    })
  },
  // 发布评论
  releaseComment(){
    if(!this.data.content){
      wx.showToast({
        title: '说点什么吧~',
        icon: 'none'
      })
      return
    }
    let data = {commentId: this.data.dynamicData.id,content:this.data.content,isMarchant:0,parentId:0}
    let that = this
    app.sjrequest('/marchant/addMarchantCommentReply',data).then(res=>{
      if(res.data.code == 200) {
        wx.showToast({
          title: '评论成功'
        })
        let reply = 'dynamicData.reply'
        this.setData({
          content:'',
          [reply]:this.data.dynamicData.reply + 1
        })
        that.getCommentInfo()
        var pages = getCurrentPages() 
        var prevPge = pages[pages.length-2]
        prevPge.data.commentList.forEach((item,index)=>{
          if(item.id == data.commentId){
            let reply =  `commentList[${index}].reply`
            prevPge.setData({
              [reply]: item.reply + 1
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  inputFocus(e) {
    console.log(e,'键盘弹起')
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
    }
    this.setData({inputHeight:inputHeight})
  },
  inputBlur() {
    this.setData({inputHeight:0,isFocus:false})
  },
  toBuy(e){
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' +  e.currentTarget.dataset.id,
    })
  },
  commentFocus(){
    this.setData({
      isFocus:true
    })
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

})