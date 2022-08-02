// pages/order/applyReturn/applyReturn.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    reasonBox:false,
    citInfo:[],
    reason:'',
    refundImageUuid:'',
    isAllRefund: true,
    supplementary:'',//说明
    inputReason:'',
    refundReason:[//退货原因
      {name:'不喜欢/不是自己想要的'},
      {name:'商品质量问题'},
      {name:'收到的商品破损、损坏'},
      {name:'商品出现了错发、漏发'},
      {name:'发票的问题'},
      {name:'收到商品与店铺描述不符合'},
      {name:'其他'}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {uniqueId:options.uniqueId}
    app.sjrequest('/order/queryCityInfo',data).then(res=>{
      if(res.data.code == 200) {
        if(options.selfUniqueId){
          this.setData({isAllRefund: false})
          res.data.data.commList.forEach(item=>{
            if(item.uniqueId == options.selfUniqueId){
              res.data.data.commList = []
              res.data.data.commList.push(item)
              return
            }
          })
        }
        this.setData({
          citInfo:res.data.data,
        })
      }
    })
  },
  // 上传图片
  uploadImage(){
    const _this = this
    wx.chooseImage({
      count: 6-_this.data.fileList.length,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success (res) {
        res.tempFilePaths.forEach((item, index) => {
          _this.data.fileList.push(item)
        })
        _this.setData({
          fileList: _this.data.fileList
        })
      }
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
  // 删除图片
  delImg(e){
    const { index } = e.currentTarget.dataset
    let imgList = this.data.fileList
    imgList.splice(index,1)
    this.setData({
      fileList: imgList
    })
  },
  // 拒绝退货
  refund(){
    this.setData({ reasonBox:true })
  },
  // 取消拒绝退货
  refundOnClose() {
    this.setData({ reasonBox: false });
  },
  // 选择拒绝原因
  radioChange(e) {
    const refundReason = this.data.refundReason
    for (let i = 0, len = refundReason.length; i < len; ++i) {
      refundReason[i].checked = refundReason[i].name === e.detail.value
    }
    this.setData({
      refundReason
    })
  },
  // 输入原因
  inputEvent(e){
    this.setData({
      inputReason:e.detail.value
    })
  },
  inputText(e){
    this.setData({
      supplementary:e.detail.value
    })
  },
  //确认原因
  sureReason(){
    this.data.refundReason.forEach(item=>{
      if(item.checked){
        this.setData({
          reason:item.name
        })
      }
    })
    if(this.data.reason == '其他') {
      if(this.data.inputReason == '') {
        wx.showToast({
          title: '请输入退款原因',
          icon: 'none'
        })
        this.setData({
          reason:''
        })
        return
      }else{
        this.setData({reason:this.data.inputReason})
      }
    }
    this.setData({
      reasonBox: false,
      inputReason: ''
    })
  },
  // 选择其他
  inputFocus(){
    const refundReason = this.data.refundReason
    for (let i = 0, len = refundReason.length; i < len; ++i) {
      refundReason[i].checked = refundReason[i].name == '其他'
    }
    this.setData({
      refundReason
    })
  },
  // 上传图片
  upload(count){
    const _this = this
    var fxToken = wx.getStorageSync('token')
    wx.uploadFile({
      url: app.globalData.imgUrl2, //仅为示例，非真实的接口地址
      filePath: _this.data.fileList[count],
      name: 'imgs',
      formData:_this.data.refundImageUuid?{'uuid': _this.data.refundImageUuid,token:wx.getStorageSync('token')}:{token:wx.getStorageSync('token')},
      header:{
        token:fxToken,
        "Content-Type": "multipart/form-data", //form-data格式
        'Accept': 'application/json', 
      },
      complete (res){
        console.log(res)
        count++
        _this.setData({
          refundImageUuid: JSON.parse(res.data).data.imgUuid
        })
        if(count==_this.data.fileList.length){
          // 图片上传完毕，去上传文字
          _this.sureRefund()
        }else{
          _this.upload(count)
        }
      }
    })
  },
  // 提交评论
  submit(){
    if(this.data.reason==''){
      wx.showToast({
        title: '请选择退货原因',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    if(this.data.fileList.length==0){
      this.sureRefund()
    }else{
      this.upload(0)
    }
  },
  //确认退货
  sureRefund(){
    let that = this;
    if(this.data.isAllRefund){
      var data = {uniqueId:this.data.citInfo.uniqueId,reason:this.data.reason,orderId:this.data.citInfo.orderId,supplementary:this.data.supplementary}
    }else{
      var data = {uniqueId:this.data.citInfo.commList[0].uniqueId,reason:this.data.reason,supplementary:this.data.supplementary,orderId:this.data.citInfo.orderId,orderCommodityId:this.data.citInfo.commList[0].orderCommodityId}
    }
    data.refundImageUuid = this.data.refundImageUuid
    var token = wx.getStorageSync('token')
    let appid = wx.getStorageSync('appid')
    let data2s = {
        authorizerAppid:appid,
        sceneType:3
    }
    app.mb2request('/subTemplate/listPriTemplateId',data2s).then(res=>{
      let tempData = res.data.data
      wx.requestSubscribeMessage({
          tmplIds: tempData,
          success: function (res) {
            let data3s = {
              status: 1,
              marchantId: that.data.citInfo.marchantId,
              templateIds: tempData,
              appId:appid,
              targetId:that.data.citInfo.orderId,
              targetType:4
          }
            app.sjrequest('/basic/addsubscription', data3s).then(res => {
              
          })
          },
          complete: function () {
          app.sjrequest1('/order/fastchargeback',data,token).then(res=>{
            if(res.data.code == 200) {
              wx.showToast({
                title: '已发起申请',
                icon: 'none',
                duration: 2000,
              })
              setTimeout(res=>{
                wx.navigateBack({
                  delta: 2,
                })
              },2000)
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })
        }
      })
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