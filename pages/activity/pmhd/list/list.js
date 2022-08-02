// pages/activity/pmhd/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auctionList:[],
    pageNum: 1, // 当前页
    pageSize: 10, // 每页大小
    stopLoading: true,
    merchantId: '',
    reqComplete:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      const scene = decodeURIComponent(options.scene)
      this.getCodeParams(scene)
    }{
      app.globalData.options = options
      this.setData({
        merchantId:options.marchantId?options.marchantId:options.merchantId || 275
      },()=>{this.getAuctionList()});
      
    }
  },
  getCodeParams(id){
    let data = {id : id} 
    let that = this
    app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
      if(res.data.code == 200) {
        that.setData({
          merchantId: JSON.parse(res.data.data.scene).id
        })
        that.getAuctionList()
      }
    })
  },
  getAuctionList(){
    const params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      merchantId: this.data.merchantId
    }
    app.request.auctionRequest('/auction/list', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        if (result.length < this.data.pageSize) {
          this.setData({
            stopLoading:false
          })
        }
        this.setData({
          auctionList: this.data.auctionList.concat(result),
          reqComplete:true
        })
      }
    })
  },
  toDetails(e){
    const {auctionid} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/activity/pmhd/details/details?auctionId=${auctionid}`,
    })
  },
  changeTime(e){
    const {index} = e.currentTarget.dataset
    this.data.auctionList[index].timeData = e.detail
    this.setData({
      auctionList: this.data.auctionList
    });
  },
  toPmEnter(){
    wx.navigateTo({
      url: '/pages/activity/pmhd/pmEnter/pmEnter?marchantId=' + this.data.merchantId,
    })
  },
  toShop(){
    wx.navigateTo({
      url: '/pages/shopHome/home/home?marchantId=' + this.data.merchantId,
    })
  },
  onReachBottom: function () {
    if (this.data.stopLoading) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getAuctionList()
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.auctionList[0].xsAuctionItem.merchantName
    }
  }
})