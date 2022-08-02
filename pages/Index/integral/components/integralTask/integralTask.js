// pages/Index/integral/components/integralTask/integralTask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marchantId:{
			type:Number,
			value:1
    },
    text:{
      type:String,
      value:'你已完成发布动态积分任务获取2积分'
    },
    showTaskPop:{
      type:Boolean,
      value:false
    }
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
    closePop(){
      console.log(this.properties.marchantId)
      this.setData({
        showTaskPop:false
      })
    },
    toExchange(){
      this.closePop()
      wx.navigateTo({
        url: `/pages/Index/integral/integral?marchantId=${this.properties.marchantId}`,
      })
    }
  }
})
