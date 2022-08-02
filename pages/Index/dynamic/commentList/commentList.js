
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
    stick:0
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
      stick:options.stick
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
  toDetail(e){
    let item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/Index/dynamic/userDynamicDetails/userDynamicDetails?item=' + encodeURIComponent(item),
    })
  },
  // 获取订阅通知列表
  getCommunityList(){
    let data = {marchantId:this.data.marchantId,pageCurr:this.data.pageCurr,pageSize:10,stick:this.data.stick,isMarchant:0}
    return app.sjrequest('/marchant/queryMarchantCommentNew',data).then(res=>{
      if(res.data.code == 200){
        res.data.data.forEach(item=>{
          item.addTime = formate.formatTime(item.addTime)
        })
        this.setData({
          pageCurr: this.data.pageCurr + 1,
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
  /**图片预览 */
  imgClick(e){
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: imgList
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