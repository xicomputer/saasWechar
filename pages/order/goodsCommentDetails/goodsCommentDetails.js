// pages/order/goodsCommentDetails/goodsCommentDetails.js
const time = require("../../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fabu:'发布评论',
    value:'',
    id:0,
    userid:'',
    name:'',
    goodsCommentDetails:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsCommentDetails: app.globalData.goodsCommentDetails
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
  // 点赞
  liketap(e){
    var id=e.currentTarget.dataset['id']
    var data={'commentId':id}
    app.sjrequest('/orderComment/operationPraise',data).then(res =>{
      var list=this.data.goodsCommentDetails
      list.myPraise=!list.myPraise
      if (list.myPraise) {
        list.praise += 1;
      } else {
        list.praise -= 1;
      }
      this.setData({goodsCommentDetails:list})
    })
  },
    // 评论列表
    getComment(){
      var data={'commentId':this.data.goodsCommentDetails.id}
      app.sjrequest('/orderComment/queryOrderCommentReply',data).then(res =>{
        var list = res.data.data
        for(var i in list){
          list[i].addTime=time.formatTime(list[i].addTime)
        }
        this.setData({commentReply:res.data.data})
      })
    },
    // 点击评论
    reply(e){
      var id = e.currentTarget.dataset['id']
      var name = e.currentTarget.dataset['name']
      var userid = e.currentTarget.dataset['userid']
      this.setData({
        id:id,
        name:name,
        userid:userid,
        fabu:'回复'+name,
        isfocus:true
      })
    },
    // 绑定input值
    getvalue(e){
      var val = e.detail.value;
      this.setData({value:val});
    },
    // 发送评论
  fasong(){
    if(this.data.value==''){
      wx.showToast({
        title: '说点什么吧~',
        icon: 'none'
      })
    }else{
      var data={
        'commentId':this.data.goodsCommentDetails.id,
        'content':this.data.value,
        'isMarchant':0,
        'parentId':this.data.id,
        'userReplyId':this.data.userid || this.data.goodsCommentDetails.userId,
        'userReplyName':this.data.name || this.data.goodsCommentDetails.nickname,
      }
      app.sjrequest('/orderComment/addOrderCommentReply',data).then(res =>{
        if(res.data.code==200){
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
          this.getComment()
          var list = this.data.goodsCommentDetails
          list.reply = list.reply + 1
          wx.setStorage({
            key: 'goodsCommentDetails',
            data: JSON.stringify(list)
          })
          this.setData({
            value: '',
            id:0,
            fabu:'发布评论',
            userid:this.data.goodsCommentDetails.userId,
            name:this.data.goodsCommentDetails.nickname,
            goodsCommentDetails:list
          })
        }

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
    this.getComment()
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