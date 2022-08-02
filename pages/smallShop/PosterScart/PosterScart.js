const app = getApp()
Page({
  data: {
    webViewUrl: '',
    testUrl:'',
    storeId:0,

    imgs:[
      {src:'',width:40,height:40,x:17,y:19},
      {
        src:'../../img/poster/poster_shop_xing.png',
        width:75,height:14,x:238,y:20
      },
      {
        src:'../../img/poster/poster_shop_xing.png',
        width:75,height:14,x:238,y:36
      },
      {
        src:'https://xssj.letterbook.cn/applet/images/poster_shop_bg.png',
        width:297,height:341,x:17,y:70
      },
      {
        src:'../../img/poster/poster_shop_right.png',
        width:31,height:10,x:120,y:475
      },
      {
        src:'',width:71,height:71,x:242,y:422
      }
    ],
    texts:[
      {content:'某某的小店',color:'#fff',size:11,x:65,y:31},
      {content:'人缘口碑：',color:'#fff',size:11,x:183,y:22},
      {content:'颜值指数：',color:'#fff',size:11,x:183,y:38},
      {content:'小店带点货',color:'#fff',size:12,x:17,y:425},
      {content:'欢迎小店赚点生活费',color:'#fff',size:12,x:17,y:449},
      {content:'长按扫码进入小店',color:'#FFDF36',size:12,x:17,y:473}
    ],
    testimgUrl:'',//生成的海报地址
  },

  onLoad: function (options) {    
    this.reqParams={...options};
    this.setData({ storeId:options.storeId });
  },

  setImg2obj: function (obj) {
    let o = {}
    for (let i in obj) {
      let key = this.setImg2objSub(obj[i])[0]
      o[key] = 'data:image/png;base64,' + this.setImg2objSub(obj[i])[1]
    }
    return o

  },
  setImg2objSub: function (str) {
    let aPos = str.indexOf(':');
    let key = str.substr(0, aPos)
    let value = str.substr(aPos + 1)
    return [key, value]
  },

  getMessage(){ },
  
  navigateToH5: function () {
    let scartHaipao =  wx.getStorageSync('scartHaipao')
    let url = 'https://xssj.letterbook.cn/seals/smallShop.html'
    let curl = this.tohaipaoUrl(scartHaipao,url);
    this.setData({ webViewUrl: curl });
  },

  tohaipaoUrl(data,url){   
    let codeImg = this.data.codeImg;
    let curl = url;
    let imgInit = { ...data,codeImg }

    for (let i in imgInit) {
      imgInit[i] = encodeURI(imgInit[i])
    }
   
    var imgs=this.data.imgs;
    var texts=this.data.texts;
    imgs[0].src=data.headImgUrl;
    imgs[5].src=codeImg;
    texts[0].content=data.nickName+'的小店';
    this.setData({imgs,texts},()=>{
      wx.showLoading({title:'海报生成中'});
      this.synthetic.startSyntheticImg();
    });

    let imgInitStr = JSON.stringify(imgInit)
    curl = `${curl}?data=${imgInitStr}`
    return curl
  },

  fenxPoster(){
  },
  onShareAppMessage:function(res){
    var {storeId,nickName}=this.reqParams;
    return {
      title:nickName+"的小店",
      path: 'pages/smallShop/myShop/myShop?storeId='+storeId
    }
  },

  // 获取小程序码
  getCode(storeId) {
    let that = this;
    let scene = encodeURIComponent(`{"storeId":${storeId}}`);
    
    wx.request({
      url: 'https://xssj.letterbook.cn/xssh/merchant/appSharing',
      method: 'get',
      data: {
        page: "pages/smallShop/myShop/myShop",
        scene: scene, type: 'sj'
      },
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        that.setData({ codeImg: res.data.data },()=>{
          that.navigateToH5();
        });
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },


  //页面加载完成生命周期
  async onReady(){
    var {storeId}=this.reqParams;
    this.synthetic=this.selectComponent('.mySynthetic');
    this.getCode(storeId);
  },

  //海报合成完成回调
  getCompleteImg(event){
    var {url}=event.detail;
    this.setData({ testimgUrl:url});
    wx.hideLoading();
  },
  //保存海报
  savePoster(){this.synthetic.saveImg();},
  //长按海报
  longtapPoster(){ },

})