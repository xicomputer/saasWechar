
const app = getApp()
const time = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.item = decodeURIComponent(options.item)
    let item = JSON.parse(options.item)
    console.log('========',item)
    item.addTime = time.formatTimeSec(item.addTime)
    this.setData({
      dynamicData:item
    })
  },
  // 点赞/取消
  operationPraise(){
    let data = {commentId:this.data.dynamicData.id}
    return app.sjrequest('/marchant/operationPraise',data).then(res=>{
      let isPraise = 'dynamicData.isPraise'
      let praise = 'dynamicData.praise'
      var pages = getCurrentPages()
      var prevPge = pages[pages.length-2]
      prevPge.data.commentList.forEach((item,idx)=>{   //更新上一个页面的内容
        let isPraise1 = 'commentList['+idx+'].isPraise'
        let praise1 = 'commentList['+idx+'].praise'
        if(item.id == this.data.dynamicData.id){
          if(item.isPraise){
            prevPge.setData({
              [isPraise1]:0,
              [praise1]:this.data.dynamicData.praise - 1
            })
          }else{
            prevPge.setData({
              [isPraise1]:1,
              [praise1]:this.data.dynamicData.praise + 1
            })
          }
        }
      })
      if(this.data.dynamicData.isPraise){   //  更新当前页面的内容
        this.setData({
          [isPraise]:0,
          [praise]:this.data.dynamicData.praise - 1
        })
      }else{
        this.setData({
          [isPraise]:1,
          [praise]:this.data.dynamicData.praise + 1
        })
      }
    })
  },
  /**图片预览 */
  imgClick(e){
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: imgList
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