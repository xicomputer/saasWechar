// pages/Index/shopHome/components/goodsTypes/goodsTypes.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId:{
            type:[String,Number],
            value:1
        },
        goodsList: {
            type: Array,
            value: []
        },
        marchantId: {
            type: [String, Number],
            value: ''
        }
    },
    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            this.tempId = this.properties.tempId
            this.getTempClass();
        }
    },
    observers: {
        'goodsList': function() {
            let list = []
            let arr = []
            this.properties.goodsList.map((item, index) => {
                if (index % 10 === 0 && index !== 0) {
                    list.push(arr)
                    arr = []
                }
                arr.push(item)
            })
            list.push(arr)
            this.setData({
                list
            })
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        tempId:1,
        fillElemBg:'',
        list:[],
        typeNum:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        navito(e) {
            const {name, id} = e.currentTarget.dataset
            wx.navigateTo({
              url: `/pages/Index/GoodsList/GoodsList?category=${name}&marchantId=${this.data.marchantId}&classifyId=${id}`
            })
        },
        getTempClass(){
            var tempId=this.properties.tempId;
            var fillElemBg='';

            switch(tempId){
                case '6': fillElemBg='fill-elem2';break;
                case '7': fillElemBg='fill-elem3';break;
                case '8': fillElemBg='fill-elem4';break;
                case '9': fillElemBg='fill-elem5';break;
                case '10': fillElemBg='fill-elem6';break;
                case '11': fillElemBg='fill-elem7';break;
                default : fillElemBg='fill-elem1';
            }
            

            this.setData({fillElemBg});
        }
    }
})
