// pages/Index/shopHome/components/componentsPage/member/member.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        memberGoodsList:{
            type:Array
        },
        userInfo:{
            type:Object
        },
        isIntegral:{
            type:[Number,String]
        },
        marchantId:{
            type:[[Number,String]]
        },
        detailData:{
            type:Object
        }
    },
    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            this.userInfo = this.properties.userInfo
            this.memberGoodsList =this.properties.memberGoodsList
            this.isIntegral =this.properties.isIntegral
            this.marchantId =this.properties.marchantId
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        memberGoodsList:[],
        userInfo:{},
        isIntegral:0,
        marchantId:null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 跳会员
        toMember(){
            console.log(this.userInfo)
            wx.navigateTo({
            url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
            })
        },
        goshop(e){
            const {name, id} = e.currentTarget.dataset
            wx.navigateTo({
                url: `/pages/Index/GoodsDetails/GoodsDetails?id=`+id+`&memberShow=1`
            })
        },
    },
})
