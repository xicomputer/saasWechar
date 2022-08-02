// pages/Dynamic/MyDynamic/MyDynamic.js
const app = getApp()
const time = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCurr: 1,
    pageSize: 15,
    dynamicList:[],
    stopLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  showMyDynamic(){
    var data={'pageCurr':this.data.pageCurr,'pageSize':this.data.pageSize}
    app.sjrequest('/marchant/queryMyComm',data).then(res =>{
      var list = res.data.data
      for(var i in list){
        list[i].addTime=time.formatTime(list[i].addTime)
        var contentString = ''
        var contentList = JSON.stringify(list[i].content)
        contentList = contentList.slice(1,contentList.length-1)
        contentList = contentList.split('\\n')
        contentList.forEach(item => {
            contentString = contentString + item+'<br />'
        });
        list[i].content = contentString
      }
      this.setData({
        dynamicList:this.data.dynamicList.concat(list)
      })
      if(list.length<1){
        this.setData({
          stopLoading:false
        })
      }
      wx.stopPullDownRefresh()
    })
  },
  // 评论
  toComment(e){
    var item=e.currentTarget.dataset['item']
    wx.setStorage({
      key: 'commentListItem',
      data: JSON.stringify(item)
    })
    wx.navigateTo({
      url:'../DynamicDetails/DynamicDetails'
    })
  },
  // 点赞
  liketap(e){
    var id=e.currentTarget.dataset['id']
    var index=e.currentTarget.dataset['index']
    var data={'commentId':id}
    app.sjrequest('/dynamic/praise',data).then(res =>{
      var list=this.data.dynamicList
      list[index].isPraise=!list[index].isPraise
      if (list[index].isPraise) {
        list[index].praise += 1;
      } else {
        list[index].praise -= 1;
      }
      this.setData({dynamicList:list})
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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.setData({
        pageCurr:1,
        stopLoading:true,
        dynamicList:[]
      })
      this.showMyDynamic()
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setData({
      pageCurr:1,
      stopLoading:true,
      dynamicList:[]
    })
    this.showMyDynamic()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.stopLoading){
      this.setData({
        pageCurr:this.data.pageCurr+1
      })
      this.showMyDynamic()
    }
  },

  /**
   * 用户点击右上角分享
   */
   
})