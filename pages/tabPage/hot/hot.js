// pages/tabPage/hot/hot.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    leftList:[],
    rightList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getVideoList();
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
  onShareAppMessage: function () {

  },

  getVideoList(){
    app.sjrequest('/commodity/queryVideoCommodityList').then(res=>{
        console.log('列表数据：',res);
        if(res && res.data.data){
          var list=res.data.data;
          var leftList=this.data.leftList;
          var rightList=this.data.rightList;
          for(var i=0;i<list.length;i++){
            if(i%2==0){
              leftList.push(list[i]);
            }else{
              rightList.push(list[i]);
            }
          }
          this.setData({leftList,rightList,list})
        }
    })
  },

  toVideoPlay(e){
    var id=e.currentTarget.dataset.videoid;
    var list=this.data.list;
    var firstItem={};
    list.forEach((item,index)=>{
      if(item.id==id){
        firstItem=list.splice(index,1);
      }
    });
    list.unshift(firstItem[0]);
    wx.setStorageSync('videolist_key',this.data.list);
    wx.navigateTo({
      url:'/pages/videoPlay/videoPlayList/videoPlayList'
    });
  }
  
})