// pages/PersonalCenter/followsList/followsList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCurr: 1,
    pageSize:10,
    stopLoad:false,
    followsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFollows()
  },
   // 获取关注
    getFollows(){
      let data = {pageCurr: this.data.pageCurr,pageSize: this.data.pageSize}
      app.sjrequest('/marchant/queryConcerns',data).then(res =>{
        this.setData({
          followsList:res.data.data,
        })
      })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  cancelFollow(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认取消关注吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var id=e.currentTarget.dataset.id
          var index=e.currentTarget.dataset.index
          var data={type:2,marchantId:id}
          app.sjrequest('/marchant/operateConcerns',data).then(res =>{
            if(res.data.code==200){
              that.data.followsList.splice(index,1)
              that.setData({
                followsList:that.data.followsList
              })
              wx.showToast({
                title:'取消成功',
                icon:'none'
              })
            }
          })
        }
      }
    })
    
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
    // if(this.data.stopLoad == false){
    //   this.getFollows()
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})