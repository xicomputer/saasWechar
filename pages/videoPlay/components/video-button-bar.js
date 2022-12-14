// components/video-button-bar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    itemdata:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toolBarButton: function (e) {
      const { buttontype, buttonname, itemid } = e.currentTarget.dataset;
      this.triggerEvent('buttonhandle', { buttontype, buttonname, itemid });
    },

    entryShop(e){
      var mid=e.currentTarget.dataset.mid;
      var url='/pages/shopHome/home/home?marchantId='+mid;
      wx.navigateTo({url});
    },

    buyClick(e){
      var pid=e.currentTarget.dataset.pid;
      var url='/pages/Index/GoodsDetails/GoodsDetails?id='+pid;
      wx.navigateTo({url});
    },
  }
})
