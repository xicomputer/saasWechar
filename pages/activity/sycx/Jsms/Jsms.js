const app = getApp()
const time = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillTimeList:[],
    goodsList:[],
    timeAcitve:0,
    allStock:0, // 总库存
    soldNum: 0,  // 已售出
    _options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _options:options
    })
  },
  getParams(merchantId){
    let that = this
    let data = {merchantId:merchantId||7}
    app.sjrequest('/seckill/findPeriod',data).then(res=>{
      res.data.data.forEach(item=>{
        let nowDate = new Date()
        let useTime = new Date(item.startTime*1000)
        let td =new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate())
        let od=new Date(useTime.getFullYear(),useTime.getMonth(),useTime.getDate())
        let xc=(od-td)/1000/60/60/24
        if(xc==0){
          item.showTxet = '即将开始'
         }else if(xc<2){
          item.showTxet = '明天开始'
         }else if(xc<3){
          item.showTxet = '后天开始'
         }else{
        console.log(useTime)
          let useText = `${useTime.getMonth() + 1}月${useTime.getDate()}日` 
          item.showTxet = useText
          console.log(useText)
        }
        item.startTime =  useTime.getHours() + ':' + (useTime.getMinutes()<10?'0'+useTime.getMinutes():useTime.getMinutes())
        console.log(item.startTime)
      })
      console.log(res.data.data)
      this.setData({
        seckillTimeList: res.data.data,
        goodsList:res.data.data[0].activityCommodity,
      })
      that.getStock(that.data.goodsList)
    })
  },
  // 获取总库存和已售数量
  getStock(list){
    list.forEach(item=>{
      let allStock=0,allLiveStock=0
      item.activityCommoditySku.forEach(res=>{
        allStock+=parseInt(res.stock)
        allLiveStock+=res.liveStock
      })
      item.sold = Math.floor(((allStock-allLiveStock)/allStock).toFixed(2)*100)
    })
    this.setData({goodsList:list})
  },
  // 获取商品列表
  getGoodsList(id){
    let that = this
    let data = {seckillId:id}
    app.sjrequest('/seckill/commodityList',data).then(res=>{
      this.setData({
        goodsList:res.data.data
      })
      that.getStock(that.data.goodsList)
      console.log(that.data.goodsList)
    })
  },
  // 选择时间场次
  selectTime(e){
    this.setData({
      timeAcitve: e.currentTarget.dataset.index
    })
    this.getGoodsList(e.currentTarget.dataset.id)
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
    this.setData({timeAcitve:0})
    this.getParams(this.data._options.marchantId)
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