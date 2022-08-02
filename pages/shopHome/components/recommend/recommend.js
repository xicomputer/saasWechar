// pages/Index/shopHome/components/recommend/recommend.js


// 商家推荐模块
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mainOrderType:{type:String,value:''},
        tempId: {
            type: [String, Number],
            value: 1
        },
        mainGoodsList: {   // 截取四个出来
            type: Array,
            value: []
        },
        marchantId: {
            type: String,
            value: ''
        },
        orderSwitch:{
            type:[Number, String]
        }
    },
    observers :{
      'mainOrderType': function (nowVal, oldVal) {
        if (nowVal) {
            var btnTitle = '';
            switch (Number(nowVal)) {
                case 1:
                    btnTitle = '物流发货';
                    break;
                case 2:
                    btnTitle = '同城配送';
                    break;
                case 3:
                    btnTitle = '门店团购';
                    break;
            }
            console.log(btnTitle,'btnTitle');

            this.setData({
                btnTitle
            });
        }
    },
        'mainGoodsList': function (val) {   // 截取四份数据给今日推荐
            console.log(val,'今日推荐')
            
           
            this.setData({
                recommends: val
            })

        }
    },
    /* 组件生命周期 */
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            
          },
    },

    /**
     * 组件的初始数据
     */
    data: {
        recommends: [],
        label:[]
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 跳转更多页面
        toMore() {
            wx.navigateTo({
              url: `/pages/shopHome/recommendList/recommendList?mainOrderType=${this.data.mainOrderType}`,
            })
        },
        // 去往当个商品详情页
        toGoodsDetails(e) {
            var id = e.currentTarget.dataset.id;   // 商品ID
            var mainOrderType=this.properties.mainOrderType;   // 商家经营模式
            var url='/pages/Index/GoodsDetails/GoodsDetails?id=' + id
            if(mainOrderType==2 || mainOrderType==3){
                mainOrderType==2 && (url+=`&city=1`);//同城
                mainOrderType==3 && (url+=`&reserve=1`);//预订
            }
            wx.navigateTo({url});
        },
        goComment(){
            // this.triggerEvent('myManager', '商品推荐')
            var {marchantId,mainOrderType} = this.properties;
            var query=`marchantId=${marchantId}&title=商家推荐&mainOrderType=${mainOrderType}`;
            wx.navigateTo({url:'/pages/shopHome/column/column?'+query});
        },
    }
})