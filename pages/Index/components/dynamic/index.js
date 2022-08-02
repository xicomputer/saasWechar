// pages/Index/components/dynamic/dynamic.js
const app = getApp()
const time = require('../../../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marchantId:{
      type:Number,
      value:0
    },
    markerInfo:{
      type:Object,
      value:{}
    },
    status:{
      type:Number,
      value:1
    },
    hotelList:{
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    storeDynamicList:[],
    commentList:[],
    swiperIndex:0
  },
  pageLifetimes: {
    show: function() {
      // 获取商家动态
      let data = {marchantId:this.properties.marchantId,pageCurr:1,pageSize:10,isMarchant:1,stick:1}
      let data1 = {marchantId:this.properties.marchantId,pageCurr:1,pageSize:10,isMarchant:0,stick:1}
      app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
        if(res.data.code == 200){
          res.data.data.forEach(item=>{
            item.addTime = time.formatTime(item.addTime)
          })
          this.setData({
            storeDynamicList:res.data.data
          })
        }
      })
      return app.sjrequest('/marchant/queryMarchantComment',data1).then(res=>{
          res.data.data.forEach(item=>{
            item.addTime = time.formatTime(item.addTime)
          })
          this.setData({
            commentList:res.data.data
          })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**图片预览 */
    imgClick(e){
      var src = e.currentTarget.dataset.src
      var imgList = e.currentTarget.dataset.list
      wx.previewImage({
        current: src,
        urls: imgList
      })
    },
    changeSwiper(e){
      this.setData({
        swiperIndex:e.detail.current
      })
    },
    toStoreDetail(e){
      let item = JSON.stringify(e.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/pages/Index/dynamic/storeDynamicDetails/storeDynamicDetails?item=' + encodeURIComponent(item),
      })
    },
    toBuy(e){
      wx.navigateTo({
        url: '/pages/Index/GoodsDetails/GoodsDetails?id=' +  e.currentTarget.dataset.id,
      })
    },
    showDingYue(){
      this.triggerEvent('showDingYue')
    },
     // 点赞/取消
    operationPraise(e){
      let el = e.currentTarget.dataset
      let data = {commentId:el.id}
      return app.sjrequest('/marchant/operationPraise',data).then(res=>{
        let isPraise = `storeDynamicList[${el.idx}].isPraise`
        let praise = `storeDynamicList[${el.idx}].praise`
        if(this.data.storeDynamicList[el.idx].isPraise){
          this.setData({
            [isPraise]:0,
            [praise]:this.data.storeDynamicList[el.idx].praise - 1
          })
        }else{
          this.setData({
            [isPraise]:1,
            [praise]:this.data.storeDynamicList[el.idx].praise + 1
          })
        }
      })
    },
    operationPraiseUser(e){
      let el = e.currentTarget.dataset
      let data = {commentId:el.id}
      return app.sjrequest('/marchant/operationPraise',data).then(res=>{
        let isPraise = `commentList[${el.idx}].isPraise`
        let praise = `commentList[${el.idx}].praise`
        if(this.properties.commentList[el.idx].isPraise){
          this.setData({
            [isPraise]:0,
            [praise]:this.properties.commentList[el.idx].praise - 1
          })
        }else{
          this.setData({
            [isPraise]:1,
            [praise]:this.properties.commentList[el.idx].praise + 1
          })
        }
      })
    }
  }
})
