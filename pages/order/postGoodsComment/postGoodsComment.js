// pages/order/postGoodsComment/postGoodsComment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    marchantId: 0,//商家id
    commodityId: 0,//商品id
    commodityLogo: '',//商品图片
    commodityName: '',//商品名称
    orderUniqueId: '',//订单uid
    // tempFilePaths: [],//临时文件数组
    imgUuid:'',//图片组标识对象
    startLevel: 0,//等级
    content: '',//评价内容
    contentLen:0,//评价长度
    fileList: [],//评价图片
    isAnonymous:false,//是否匿名
    startList:[
      {name:''},
      {name:'非常差'},
      {name:'差'},
      {name:'一般'},
      {name:'好'},
      {name:'非常好'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //更改星级等级
  changeStartLevel(e){
    const { index } = e.currentTarget.dataset
    this.setData({
      startLevel:index
    })
  },
  // 绑定评价内容
  getInputValue(e){
    const value = e.detail.value
    this.setData({
      content: value,
      contentLen:value.length>100?100:value.length
    })
  },
  // 上传图片
  uploadImage(){
    const _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success (res) {
        const fileList = res.tempFilePaths[0]
        const tempFilePaths = _this.data.fileList
        tempFilePaths.push(fileList)
        _this.setData({
          fileList: tempFilePaths
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
  // 是否匿名评价
  changeAnonymous(){
    this.setData({
      isAnonymous:!this.data.isAnonymous
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
      header:{
          token:fxToken,
          "Content-Type": "multipart/form-data", //form-data格式
          'Accept': 'application/json', 
      },
      formData: _this.data.imgUuid?{'uuid': _this.data.imgUuid}:{},
      complete (res){
        count++
        _this.setData({
          imgUuid: JSON.parse(res.data).data.imgUuid
        })
        if(count==_this.data.fileList.length){
          // 图片上传完毕，去上传文字
          _this.sendComment()
        }else{
          _this.upload(count)
        }
      }
    })
  },
  // 发送评论
  sendComment(){    
    const data={
      marchantId: this.data.marchantId,//商家id
      commodityId: this.data.commodityId,//商品id
      commodityName: this.data.commodityName,//商品id
      orderUniqueId: this.data.orderUniqueId,//订单uid
      isMarchant: 0,//是否为商家1-商家，0-用户
      grade:this.data.startLevel?this.data.startLevel:5,//评价等级
      content: this.data.content,//评价内容
      // imgs: this.data.fileList,//评价图片
      imgUuid:this.data.imgUuid,//图片标识
      anonymous:this.data.isAnonymous?1:0,//是否匿名0-否,1-是
    }
    if(this.data.content=='' && this.data.fileList.length==0){
      wx.showToast({
        title: '说点儿什么吧 ~~',
        icon: 'none'
      })
      return ;
    }
    var token = wx.getStorageSync('token')
    app.sjrequest('/orderComment/addOrderComment',data).then(res =>{
      if(res.data.code==200){
        wx.showToast({
          title: '评价成功',
        })
        wx.redirectTo({
          url: '../goodsCommentList/goodsCommentList?commodityId='+this.data.commodityId,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  // 提交评论
  submit(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(this.data.fileList,"22222222")
    if(this.data.fileList.length==0){
      this.sendComment()
    }else{
      this.upload(0)
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
    this.setData({
      marchantId: app.globalData.marchantId,//商家id
      commodityId: app.globalData.commodityId,//商品id
      commodityLogo: app.globalData.commodityLogo,//商品图片
      commodityName: app.globalData.commodityName,//商品名称
      orderUniqueId: app.globalData.orderUniqueId,//订单uid
    })
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