const app = getApp()

Page({
  data: {
    //测试视频列表
    videoList: [ ],
     //测试直播地址
    liveList:[ ],
    playerType:'video',
    fitType:'contain',
    currentVid:'',
    shareTitle:'',
  },

  onShow(){
    wx.hideHomeButton();//隐藏返回首页按钮
  },
  
  onShareAppMessage(){
    return {
      path:'/pages/videoPlay/videoPlayList/videoPlayList?id='+this.data.currentVid,
      title:this.data.shareTitle
    }
  },

  onShareTimeline(){
    return {
      path:'/pages/videoPlay/videoPlayList/videoPlayList?id='+this.data.currentVid,
      title:this.data.shareTitle
    }
  },

  onLoad:function(option){
    if(wx.getStorageSync('wx_userinfo_key')){
      if(option && option.id){
        this.getVideoList(option.id);
      }else{
        var videolist=wx.getStorageSync('videolist_key');
        if(this.data.playerType==='video'){
          videolist = this.controlVideoPlayer(videolist, 0);
          this.setData({ videoList: videolist },()=>{
            wx.removeStorage({
              key:'videolist_key'
            });
          });
        }else{
          let _listlist = this.controlVideoPlayer(this.data.liveList, 0);
          this.setData({
            videoList: _listlist
          });
        }
      }
    }else{
      wx.navigateTo({
        url: '/pages/shopHome/home/home',
      })
    }
  },

  getVideoList(id){
    app.sjrequest('/commodity/queryVideoCommodityList').then(res=>{
      if(res && res.data.data){
        var list=res.data.data;
        var firstItem=null;
        list.forEach((item,index)=>{
          if(item.id==id){
            firstItem=list.splice(index,1)[0];
          }
        });
        list.unshift(firstItem);
        var _list=this.controlVideoPlayer(list,0);
        this.setData({videoList:_list});
      }
    })
  },

  //修改视频属性 保证只有一个video被创建
  controlVideoPlayer: function (list, index) {
    //index=index>=(list.length-1)?0:index;
    if(list.length===0){
       return [];
    }else{
      list.forEach((item,i)=>{
        if (index === i){
          item.video_is_player=true;
          this.setData({
            currentVid:item.id,
            shareTitle:item.description
          });
        }else{
          item.video_is_player=false;
        }
      });
      return list;
    }
  },

  //上滑事件
  swipeUpper:function(e){
    const { newindex}=e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({ videoList: videolist });
  },
  
  //下滑事件
  swipeDown:function(e){
    const { newindex } = e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({
      videoList: videolist
    });
  },

  //下滑到最后一条数据
  swipeToEnd: function (e) {
    //wx.showLoading({ title: '加载中',duration:1000 });
    const {newindex,playerType}=e.detail;
    console.log('playerType', playerType,newindex);
    
    let list = this.data.videoList;
    this.setData({
      videoList: this.controlVideoPlayer(list, newindex),
    });
  },
  
  //上滑到第一条数据
  swipeToStart: function (e) {
    wx.showToast({ title: '当前第一个视频', icon: 'none'});
     console.log(e);
  },
  
})