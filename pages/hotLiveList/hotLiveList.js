// pages/kefu/kefu.js
var app = getApp();
const time = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: [], // 直播间列表，未经转换的数据
    liveListUrl:'/live/create/liveList', 
    todayLiveList:[], // 今天直播数据
    liveRecording:[]  // 存放直播记录数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getLiveList()
  },

  // 获取直播列表
  async getLiveList() {
    let appId = wx.getStorageSync('appid')
    let marchantId = Number(wx.getStorageSync('merchantId'))
    console.log(appId, marchantId, 'dafkhskdjfh')
    let data = {
      appId,
      marchantId,
      start : 0, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
      limit : 10 // 每次拉取的个数上限，不要设置过大，建议 100 以内
    }
    try { 
      let res = await app.sjrequest(this.data.liveListUrl, data)
      console.log(res, '直播列表')
      let formatdata = res.data.rows
      for (let item of formatdata) {   //处理日期
        item.completeStartTime = time.formatStampDate(item.start_time * 1000).split(' ')
        item.completeEndTime = time.formatStampDate(item.start_time * 1000).split(' ')
        item.formatStartTime  = time.formatStampDate(item.start_time * 1000).split('-')
        item.formatEndTime = time.formatStampDate(item.end_time * 1000).split('-')
        item.formatStartTime.push(item.formatStartTime[2].slice(0,2))
        item.formatStartTime.push(item.formatStartTime[2].slice(2,8))
        item.formatEndTime.push(item.formatEndTime[2].slice(0,2))
        item.formatEndTime.push(item.formatEndTime[2].slice(2,8))
      }
      for (let item of formatdata) {
        if (item.live_status == 101) {
          item.color = "background-color: #ED2726;"
        }else if(item.live_status == 102) {
          item.color = "background-color: #2689FF;"
        }else {
          item.color = "background-color: #BBBBBB;"
        }
      }
      this.setData({
        liveList: formatdata
      })
      this.todayLive()
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 存放今天的直播数据
  todayLive() {
    let todayTime = time.formatStampDate(Number(new Date().getTime())).split(' ')
    let data = this.data.liveList
    let todayLiveList= []  
    let liveRecording = []
    for(let item of data) {
      if (item.completeStartTime[0] == todayTime[0]) {  // 如果创建时间等于今天日期
        todayLiveList.push(item)
      }else {
        liveRecording.push(item)
      }
    }
    this.setData({
      todayLiveList,
      liveRecording
    })
  },
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

  // 跳转直播间
  async toLiveRoom(e) {
    let roomid = e.currentTarget.dataset.roomid // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    // let customParams = encodeURIComponent(JSON.stringify({
    //   path: 'pages/index/index',
    //   pid: 1
    // })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`
    })
  }
  /**
   * 用户点击右上角分享
   */

})