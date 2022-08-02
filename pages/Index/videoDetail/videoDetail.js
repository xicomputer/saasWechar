// pages/Index/videoDetail/videoDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoInfo:{},  // 视频信息
    marchantId:0,
    videoId:0,
    isShare: 0,  // 是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(options.scene){   // 小程序码
      const scene = decodeURIComponent(options.scene)
      await this.getCodeParams(scene)
    }else{ //  正常跳转
      this.setData({
        marchantId:options.marchantId,
        videoId:options.id,
        isShare:options.isShare||0
      })
    }
    this.getVideoInfo(this.data.marchantId,this.data.videoId)
  },
  //是否从小程序码进来
  getCodeParams(id){
    let data = {id : id} 
    let that = this
    return app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
      if(res.data.code == 200) {
        that.setData({
          marchantId: JSON.parse(res.data.data.scene).marchantId,
          videoId: JSON.parse(res.data.data.scene).id
        })
      }
    })
  },
  //  获取视频参数
  getVideoInfo(id,vid){
    let data = {marchantId:id,videoId:vid}
    app.sjrequest('/commodity/queryVideoCommodityDetails',data).then(res=>{
      if(res.data.code == 200 ){
        this.setData({
          videoInfo:res.data.data
        })
      }
    })
  },
  toBuy(e){
    wx.navigateTo({
      url: `/pages/Index/GoodsDetails/GoodsDetails?id=${e.currentTarget.dataset.id}`,
    })
  },
  toStore(){
    wx.navigateTo({
      url: `/pages/shopHome/home/home?marchantId=${this.data.marchantId}`,
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
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    return {
      title: this.data.videoInfo.commodityName,
      path: `/pages/Index/videoDetail/videoDetail?marchantId=${this.data.marchantId}&id=${this.data.videoId}&isShare=1`,
      imageUrl:this.data.videoInfo.coverUrl
    }
  },
  onShareTimeline: function () {
		return {
	      title: this.data.videoInfo.commodityName,
	      query: `marchantId=${this.data.marchantId}&id=${this.data.videoId}&isShare=1`,
	      imageUrl: this.data.videoInfo.coverUrl
	    }
	}
})