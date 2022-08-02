// pages/Index/integral/integralTask/integralTask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList:[],
    showTaskPop:false,
    showGoodsDetail: false, // 是否显示商品详情
    showSelectType: false,  // 是否显示配送方式
    selectType: 0,     // 选择配送的方式
    typeList:[         // 配送方式列表
      {
        name:'门店团购',
        class:'selectType_title_item_active1'
      },
      {
        name:'商家配送',
        class:'selectType_title_item_active2'
      }
    ],
    marchantId:0, // 商家id
    exchangeGoodsList:[],  // 可兑换商品列表
    nowGoodsDetail:{},   //当前商品详情
    userintegral: 0,     //用户积分
    toStoreContactMan:'', // 到店的联系人
    toStoreAddress:'',    // 到店的地址
    toStoreTel:'',        // 到店的联系电话
    logisticsContactMan:'',// 配送的联系人
    logisticsAddress:'',   // 配送的地址 
    logisticsTel:'',       // 配送的联系电话
    messageValue:'',   // 留言
    hideTabs: true,   // 是否有tab类型选择
    minDate:new Date().getTime(),  // 可选最小时间
    maxDate:new Date().getTime()+6*24*60*60*1000,    // 可选最大时间
    showTimeSelect: false,  // 选择时间弹框
    currentDate: '',  // 当前选择框时间中间变量
    selectedTime:'',  // 当前所选时间
    community: 0,    // 是否开启订阅通知
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marchantId:options.marchantId
    })
  },
  // 获取参数
  getTaskNum(){
    let data = {marchantId:this.data.marchantId}
    return app.sjrequest('/integral/queryMyTaskList',data).then(res=>{
      this.setData({
        taskList:res.data.data
      })
    })
  },
  // 查询积分商品信息
  getIntegralInfo(){
    let that = this
    let data = { marchantId: this.data.marchantId }
    return app.sjrequest('/integral/queryPrize',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        let goodsList =[]
        res.data.data.forEach(item=>{
          if(that.data.userintegral >=item.score && item.rest!=0){
            goodsList.push(item)
          }
        })
        this.setData({
          exchangeGoodsList:goodsList
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //  查询用户积分
  getUserIntegral(){
    let data = { marchantId: this.data.marchantId }
    return app.sjrequest('/integral/queryInte',data).then(res=>{
      if(res.data.code == 200){
        this.setData({
          userintegral:res.data.data.score,
          toStoreContactMan:res.data.data.merchantInfo.legalPerson||res.data.data.merchantInfo.nickName,
          toStoreTel:res.data.data.merchantInfo.telephone,
          community:res.data.data.merchantInfo.community,
          toStoreAddress:res.data.data.merchantInfo.entirelyAddress
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 显示商品详情弹框
  showDetail(e){
    let idx = e.currentTarget.dataset.idx
    this.setData({
      showGoodsDetail:true,
      nowGoodsDetail:this.data.exchangeGoodsList[idx]
    })
  },
  // 关闭商品详情弹框
  closeDetail(){
    this.setData({
      showGoodsDetail:false
    })
  },
  // 显示方式选择
  showSelectType(e){
    let idx = e.currentTarget.dataset.idx
    if(idx>=0){
      this.setData({
        nowGoodsDetail:this.data.exchangeGoodsList[idx]
      })
    }
    if(this.data.nowGoodsDetail.score>this.data.userintegral){
      wx.showToast({
        title: '您的积分不足',
        icon: 'none'
      })
      return
    }
    if(this.data.nowGoodsDetail.rest==0){
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return
    }
    if(this.data.nowGoodsDetail.disbursement==3){  //两种都有
      this.setData({
        hideTabs:false,
        selectType:0
      })
    }else{    // 只有一种
      this.setData({
        hideTabs:true,
        selectType:this.data.nowGoodsDetail.disbursement-1
      })
    }
    this.setData({
      showSelectType:true,
      showGoodsDetail:false,
    })
  },
  // 显示方式选择
  closeType(){
    this.setData({
      showSelectType:false
    })
  },
  // 更改配送方式
  changeType(e){
    this.setData({
      selectType: e.currentTarget.dataset.index
    })
  },
  // 选择配送地址
  toSelectAddress(){
    if(this.data.selectType==1) {
      app.globalData.comefrom = 'integral'
      wx.navigateTo({
        url: '/pages/Address/AddressList/AddressList',
      })
    }
  },
  // 获得留言信息
  getMessageValue(e){
    this.setData({
      messageValue: e.detail.value.trim()
    })
  },
   //  选择时间弹框
   showTimeSelect(){
    this.setData({
      showTimeSelect:true,
      currentDate:new Date(this.data.currentDate).getTime()
    })
  },
   //  关闭选择时间弹框
   closeTimeSelect(){
    this.setData({
      showTimeSelect:false
    })
  },
  onInput(event) {  // 确认时间
      this.setData({
        currentDate:this.formatDate(event.detail),
        selectedTime:this.formatDate(event.detail)
      })
    this.closeTimeSelect()
  },
  // 兑换
  exchangeIn(){
    let data = {marchantId:this.data.marchantId,presentId:this.data.nowGoodsDetail.id,getWay:this.data.selectType+1,message:this.data.messageValue}
    if(this.data.selectType==0){  // 到店
      if(!this.data.selectedTime){
        wx.showToast({
          title: '请选择到店时间',
          icon: 'none'
        })
        return
      }
      data.address = this.data.toStoreAddress
      data.contacts = this.data.toStoreContactMan
      data.contactsWay = this.data.toStoreTel
      data.arriveTime = this.data.selectedTime
    }
    if(this.data.selectType==1){ //  配送
      if(!this.data.logisticsAddress){
        wx.showToast({
          title: '请选择联系方式',
          icon: 'none'
        })
        return
      }
      data.address = this.data.logisticsAddress
      data.contacts = this.data.logisticsContactMan
      data.contactsWay = this.data.logisticsTel
    }
    wx.showLoading({
      title: '兑换中',
      mask: true
    })
    return app.sjrequest('/integral/exchangeIn',data).then(res=>{
      if(res.data.code==200){
        wx.showToast({
          title: '兑换成功'
        })
        this.setData({
          showSelectType:false
        })
        setTimeout(res=>{
          wx.navigateTo({
            url: `/pages/Index/integral/integralRecord/integralRecord?marchantId=${this.data.marchantId}`,
          })
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD ;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.getTaskNum()        // 获取用户当前任务完成情况
    await this.getUserIntegral()   // 获取用户当前积分
    this.getIntegralInfo()   // 获取用户当前积分可兑换商品列表
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