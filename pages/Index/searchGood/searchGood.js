// pages/Index/searchShop/searchShop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDel:false, // 是否处于删除状态
    list: [], // 历史记录 
    value:'',  // 搜索的值
    goodsList:[], // 店铺列表
    marchantId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        marchantId:options.marchantId
      })
      if(wx.getStorageSync('goodsRecordList')){
        this.setData({
          list:wx.getStorageSync('goodsRecordList')
        })
      }
  },
  // 搜索商家
  searchStore(){
    let data = {searchName:this.data.value,marchantId:this.data.marchantId}
    return app.sjrequest('/commodity/searchCommodity',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        if(res.data.data==''){
          wx.showToast({
            title: '该店未搜索到商品，请检查商品名称是否正确',
            icon:'none'
          })
        }
        this.setData({
          goodsList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
      this.setRecord()
    })
  },
  // 跳店铺
  toStore(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      value:e.currentTarget.dataset.name
    })
    this.setRecord()
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id,
    })
    this.setData({
      value:null
    })
  },
  // 关注商家
  followStore(e){
    let that = this
    let data = {marchantId:e.currentTarget.dataset.id,type:1}
    app.sjrequest('/marchant/operateConcerns',data).then(res =>{
      if(res.data.code==200){
        wx.showToast({
          title: '关注成功！',
          icon: 'success'
        })
        that.setData({
          value:e.currentTarget.dataset.name
        })
        that.setRecord()
        that.searchStore()
      }
    })
  },
  // 搜索内容改变
  onChange(e) {
    this.setData({
      value: e.detail.trim(),
      goodsList: []
    })
  },
  // 改变删除状态
  changeDel(){  
    this.setData({
      isDel:!this.data.isDel
    })
  },
  // 选择历史记录
  selectRecord(e){
    if(!this.data.isDel){
      this.setData({
        value:e.currentTarget.dataset.item
      })
      this.searchStore()
      this.setRecord()
    }
  },
  // 清空历史记录
  clearRecord(){
    this.setData({
      list:[]
    })
    this.setStorage()
  },
  // 删除历史记录
  delRecord(e){
    this.data.list.splice(e.currentTarget.dataset.idx,1)
    this.setData({
      list:this.data.list
    })
    this.setStorage()
  },
  // 点击搜索
  onClick(){
    if(this.data.value){
      wx.showLoading({
        title: '搜索中',
      })
      this.searchStore()
    }else{
      wx.showToast({
        title: '请先输入商家店名',
        icon: 'none'
      })
    }
  },
  // 把历史记录存储到本地缓存
  setRecord(){
    console.log(this.data.value,this.data.list)
    var arr = this.data.list
    if(!!this.data.value){
      if(arr.indexOf(this.data.value)!= -1){ // 数组中存在该历史记录
        arr.unshift(...arr.splice(arr.findIndex(i => i == this.data.value), 1)) // 将他放到第一位
      }else{   // 数组中不存在该记录
        arr.unshift(this.data.value)
      }
      arr.splice(10)
      this.setData({
        list:arr
      })
    }
    this.setStorage()
  },
  // 存储到本地
  setStorage(){
    let that = this
    wx.setStorage({
      data: that.data.list,
      key: 'goodsRecordList',
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