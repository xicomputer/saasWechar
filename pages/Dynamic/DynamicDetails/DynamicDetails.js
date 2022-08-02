// pages/Dynamic/DynamicDetails/DynamicDetails.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
const time = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentListItem:[],
    commentReply:[],
    fabu:'发布评论',
    value:'',
    id:0,
    name:'',
    userid:'',
    isfocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const commentListItem= JSON.parse(wx.getStorageSync('commentListItem'))
    this.setData({commentListItem:commentListItem})
    this.getComment(commentListItem.id)
  },
  // 点赞
  liketap(e){
    var id=e.currentTarget.dataset['id']
    var index=e.currentTarget.dataset['index']
    var data={'commentId':id}
    app.sjrequest('/dynamic/praise',data).then(res =>{
      var list=this.data.commentListItem
      list.isPraise=!list.isPraise
      if (list.isPraise) {
        list.praise += 1;
      } else {
        list.praise -= 1;
      }
      this.setData({commentListItem:list})
    })
  },
  // 评论列表
  getComment(id){
    var data={'commentId':id}
    app.sjrequest('/marchant/queryMarchantCommentReply',data).then(res =>{
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
      Toast('说点什么吧~')
    }else{
      var data={
        'commentId':this.data.commentListItem.id,
        'content':this.data.value,
        'isMarchant':0,
        'parentId':this.data.id,
        'userReplyId':this.data.userid,
        'userReplyName':this.data.name,
      }
      app.sjrequest('/marchant/addMarchantCommentReply',data).then(res =>{
        if(res.data.code==200){
          Toast('发送成功')
          this.getComment(this.data.commentListItem.id)
          var list = this.data.commentListItem
          list.reply = list.reply + 1
          wx.setStorage({
            key: 'commentListItem',
            data: JSON.stringify(list)
          })
          this.setData({
            value: '',
            id:0,
            fabu:'发布评论',
            userid:this.data.commentListItem.userInfo.id,
            name:this.data.commentListItem.userInfo.nickname,
            commentListItem:list
          })
        }

      })
    }
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