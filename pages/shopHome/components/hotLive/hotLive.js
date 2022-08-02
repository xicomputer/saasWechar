// pages/Index/shopHome/components/goodsTypes/goodsTypes.js
var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },
    /* 组件生命周期 */
    lifetimes:{
      attached:function () {
        this.getLiveList()
      }
    },
    observers: {
       
    },
    /**
     * 组件的初始数据
     */
    data: {
      liveList: [], // 直播间列表

    },

    /**
     * 组件的方法列表
     */
    methods: {
      async getLiveList() {
        let appId = wx.getStorageSync('appid')
        let marchantId = Number(wx.getStorageSync('merchantId'))
        let data = {
          appId,
          marchantId,
          start : 0, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
          limit : 10 // 每次拉取的个数上限，不要设置过大，建议 100 以内
        }
        console.log(data, '直播列表请求参数')
        try { 
          let res = await app.sjrequest('/live/create/liveList', data)
          let resData = res.data.rows.splice(0,5)  // 最多展示五个
          for (let item of resData) {
            if (item.live_status == 101) {
              item.color = "background-color: #ED2726;"
            }else if(item.live_status == 102) {
              item.color = "background-color: #2689FF;"
            }else {
              item.color = "background-color: #BBBBBB;"
            }
          }
           // 直播中的展示最多五个，直播结束的最多展示两个
          this.setData({
            liveList: resData
          })
          console.log(this.data.liveList, '首页直播列表')
        } catch (error) {
          console.log(error)
        }
      },
      toMore(){
        wx.navigateTo({
          url: '/pages/hotLiveList/hotLiveList',
        })
      },
      // 跳转直播间
      async toLiveRoom(e) {
        let roomid = e.currentTarget.dataset.roomid // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
        console.log(roomid, '房间号房间号')
        // let customParams = encodeURIComponent(JSON.stringify({
        //   path: 'pages/index/index',
        //   pid: 1
        // })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`
        })
      }
 	}
})
