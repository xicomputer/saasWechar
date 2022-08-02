// pages/smallShop/releaseDynamic/releaseDynamic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[], // 图片数据
    content: '', // 输入的内容
    imgUuid:'', // 图片imgUuid
    storeId:0,  // 小店id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marchantId:options.marchantId,
    })
  },
  // 赋值
  bindTextAreaBlur: function(e) {
    this.setData({
      content:e.detail.value
    })
  },
  // 取消
  cancel(){
    wx.showModal({
      content: '确定要取消发布吗？',
      showCancel: true,//是否显示取消按钮
      cancelText:"继续发布",//默认是“取消”
      cancelColor:'#576b95',//取消文字的颜色
      confirmText:"取消发布",//默认是“确定”
      confirmColor: '#ccc',//确定文字的颜色
      success: function (res) {
         if (res.cancel) {
            //点击取消,默认隐藏弹框
            return
         } else {
          wx.navigateBack({
            delta: 0,
          })
         }
      }
   })
  },
  // 选择图片
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
  // 预览图片
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
  // 上传图片
  upload(count){
    const _this = this
    var fxToken = wx.getStorageSync('token')
    wx.uploadFile({
      url: app.globalData.imgUrl2, //仅为示例，非真实的接口地址
      filePath: _this.data.fileList[count],
      name: 'imgs',
      formData:_this.data.imgUuid?{'uuid': _this.data.imgUuid,token:wx.getStorageSync('token')}:{token:wx.getStorageSync('token')},
      header:{
        token:fxToken,
        "Content-Type": "multipart/form-data", //form-data格式
        'Accept': 'application/json', 
      },
      complete (res){
        console.log(res)
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
      content: this.data.content,//评价内容
      imgUuid:this.data.imgUuid,//图片标识
      marchantId:this.data.marchantId
    }
    var token = wx.getStorageSync('token')
    app.sjrequest('/marchant/addMarchantComment',data).then(res =>{
      if(res.data.code==200){
        wx.showToast({
          title: '发布成功,等待审核',
          icon:'none'
        })
        let result = res.data.data
        setTimeout(res=>{
          if(result.bomb){
            var pages = getCurrentPages()
            var currPage = pages[pages.length - 1] // 当前页面
            var prevPage = pages[pages.length - 2]
            if(prevPage.data.taskText){
              prevPage.setData({
                taskText:'你已完成发布动态任务获取3积分'
              })
            }
            prevPage.setData({
              showTaskPop:true
            })
          }
          wx.navigateBack({
            delta: 0
          })
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 提交评论
  submit(){
    if(this.data.content.length<5){
      wx.showToast({
        title: '评论最少5字哟~',
        icon: 'none'
      })
      return 
    }
    if(this.data.fileList.length==0){
      wx.showToast({
        title: '评论最少需要上传一张图片哟~',
        icon: 'none'
      })
      return 
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
      this.upload(0)
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