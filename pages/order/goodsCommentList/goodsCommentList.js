// pages/order/goodsCommentList/goodsCommentList.js
const time = require("../../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCurr: 1,
    pageSize: 10,
    stopLoading:true,
    commodityId:0,
    goodsCommentList:[],
    averageGrade:0,
    highGrade:0,
    bottomGrade:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.commodityId){
      this.setData({
        commodityId: options.commodityId
      })
    }
  },
  getData(){
    let data = {}
    if(this.data.commodityId){
      data={
        commodityId:this.data.commodityId,
        pageCurr:this.data.pageCurr,
        pageSize:this.data.pageSize
      }
    }else{
      data={
        pageCurr:this.data.pageCurr,
        pageSize:this.data.pageSize
      }
    }
    app.sjrequest('/orderComment/queryOrderCommentList',data).then(res =>{
      if(res.data.code===200){
        let result = res.data.data
        let list = result.list
        list.forEach(item => {
          item.addTime=time.formatTime(item.addTime)
        });
        this.setData({
          goodsCommentList:this.data.goodsCommentList.concat(list),
          averageGrade:result.averageGrade,
          highGrade:result.highGrade,
          bottomGrade:result.bottomGrade
        })
        if(list.length<1){
          this.setData({
            stopLoading:false
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },
  // 放大图片
  zoomImg(e){
    const { src,list } = e.currentTarget.dataset
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  // 评论
  toComment(e){
    var item=e.currentTarget.dataset['item']
    app.globalData.goodsCommentDetails = item
    wx.navigateTo({
      url:'../goodsCommentDetails/goodsCommentDetails'
    })
  },
    // 点赞
    liketap(e){
      var id=e.currentTarget.dataset['id']
      var index=e.currentTarget.dataset['index']
      var data={'commentId':id}
      app.sjrequest('/orderComment/operationPraise',data).then(res =>{
        var list=this.data.goodsCommentList
        list[index].myPraise=!list[index].myPraise
        if (list[index].myPraise) {
          list[index].praise += 1;
        } else {
          list[index].praise -= 1;
        }
        this.setData({goodsCommentList:list})
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
    this.setData({
      pageCurr:1,
      stopLoading:true,
      goodsCommentList:[]
    })
    this.getData()
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
    this.setData({
      pageCurr:this.data.pageCurr+1,
      stopLoading:true
    })
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
   
})