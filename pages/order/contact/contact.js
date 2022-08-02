// pages/order/contact/contact.js
const app = getApp()
const time = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoPic:'',
    chatValue:'',
    timer:'',
    chatList:[],
    headimgurl:'',
    chatId:'',
    marchantId:'',
    marchantName:'',
    toLast: '',
    reasonHeight:'',
   
  },

  /**
   *   position: relative;absolute
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      marchantId: options.marchantId,
      marchantName: options.marchantName,
      logoPic: options.logoPic
    })
    console.log(this.data.logoPic,'logoPic')
    // this.data.timer = setInterval(() =>{
    //   this.refresh()
    // },5000)

    wx.setNavigationBarTitle({
      title: this.data.marchantName
    })

    if(this.data.chatId==''){
      this.marchantId=this.data.id
      this.openChat()
    }else{
        this.chatId=this.data.chatId
        this.getChatList(this.data.chatId)
    }
  },
  //每隔五秒刷新页面
  refresh(){
    this.getChatList(this.data.chatId)
  },
  //打开聊天窗
  openChat(){
    var data={'marchantId':this.data.marchantId}
    app.sjrequest('/basic/addChat',data).then(res =>{
      if(res.data.code==200){
        this.setData({
          chatId:res.data.data.chatId
        })
        this.getChatList(this.data.chatId)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },  
  //获得聊天内容列表
  getChatList(chatId){
    var data={'chatId':chatId}
    app.sjrequest('/basic/queryChatContent',data).then(res =>{
      if(res.data.code==200){
        wx.hideLoading()
        var temp = res.data.data
        var list = temp.contentList
        for(var i in list){
          list[i].addTime=time.formatTime(list[i].addTime)
        }
        this.setData({
          chatList:list,
          headimgurl:temp.headimgurl,
          toLast: `item${list.length}`
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //文本框的值
  changInput(e){
    var val = e.detail.value;
    this.setData({chatValue:val});
  },
  //发送聊天内容
  fsChat(){
    if(this.data.chatValue==''){
      wx.showToast({
        title: '说点什么吧~',
        icon: 'none'
      })
    }else{
      var data={
        'chatId':this.data.chatId,
        'marchantId':this.data.marchantId,
        'content':this.data.chatValue
      }
      app.sjrequest('/basic/addChatContent',data).then(res =>{
        if(res.data.code==200){
          this.setData({
            chatValue:''
          })
          this.getChatList(this.data.chatId)
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
      //清除计时器  即清除timer
    clearInterval(this.data.timer)
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