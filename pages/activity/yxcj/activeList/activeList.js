// pages/activity/yxcj/activeList/activeList.js
const time = require("../../../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    marchantId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marchantId:options.marchantId||275
    })
    this.getActiveList()
  },
  //获得活动列表
  getActiveList(){
    const data={'marchantId':this.data.marchantId,'sourceType':'H5'}
    app.sjrequest('/activity/queryActivityList',data).then(res =>{
      let list = res.data.data
      list.forEach(item => {
        item.startTime = time.formatDate(item.startTime)
        item.endTime = time.formatDate(item.endTime)
        if(item.state==1){
          item.tips = '活动暂未开始'
        }else if(item.state==2){
          item.tips = '活动进行中'
        }else if(item.state==3){
          item.tips = '活动已结束'
        }
      });
      this.setData({
        activityList:list
      })
    })
  },
  // 游戏详情
  toActiveIndex(e){
    const {id,tag,tips} = e.currentTarget.dataset
    // if(tips == '活动已结束') {
    //   wx.showToast({
    //     title: '活动已结束，去其他活动看看吧！',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.navigateTo({
      url: `../activeDetails/activeDetails?tag=${tag.toLowerCase()}&marchant=${this.data.marchantId}&activityId=${id}`,
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

  }
})