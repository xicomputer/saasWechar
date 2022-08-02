
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      address:{
          type:String,
          value:''
      },
      latitude: {
          type: Number,
          value: 0
      },
      longitude: {
          type: Number,
          value: 0
      }
  },
  /* 组件生命周期 */
  lifetimes:{
     
  },
  observers: {
      
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
    
    clickMap: function (e) {
      wx.openLocation({  
        latitude: this.data.latitude,  
        longitude: this.data.longitude,  
        scale: 18,  
        address:this.data.address
  
      })
  
    },
      
  }
})
