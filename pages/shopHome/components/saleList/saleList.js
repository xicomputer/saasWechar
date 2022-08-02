// pages/shopHome/components/saleList/saleList.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        saleGoodsList:{
            type:Array
        },
        marchantId:{
            type:[String,Number],
        },
        orderSwitch:{
            type:[Number, String]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        marchantId:0,
        saleGoodsList:[],
        skuList:[],
        buyNum:1,
        orderType:1,
        skuActive:null,
        show:false,
        goodsData:{},
        orderSwitch:null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 促销
        getCategoryGoodsList(){
            var data={
            'marchantId':this.data.marchantId
            }
            app.sjrequest('/commodity/queryPromotionList',data).then(res =>{
            if(res.data.code==200){
                wx.hideLoading()
                this.setData({
                saleGoodsList: res.data.data
                })
            }else{
                wx.showToast({
                title: res.data.msg,
                icon:'none'
                })
            }
            })
        },
        // 去下单
        goBuy(e){
            var item = e.currentTarget.dataset.item
            item.stock='请选择规格'
            item.itemText='请选择规格'
            this.setData({
            goodsData:item,
            buyNum:1,
            skuActive:null,
            show:true
            })
            this.getSku(item.id)
        },
        // 获得商品规格
        getSku(commodityId){
            var that = this
            var data={'commodityId':commodityId,marchantId:this.properties.marchantId}
            app.sjrequest('/commodity/queryCommoSku',data).then(res =>{
            if(res.data.code==200){
                that.setData({
                skuList: res.data.data,
                goodsData: res.data.data[0]
                })
                res.data.data.forEach((item,index)=>{
                let skuItem = 'skuList[' + index + '].active'
                if(item.isDefault == 1) {
                    that.setData({
                    [skuItem]: true,
                    goodsData: item
                    })
                }else{
                    that.setData({
                    [skuItem]: false
                    })
                }
                })
            }
            })
        },
            //关闭商品弹框
        onClose1(){
            this.setData({
            show:false,
            })
        },
        // 切换 sku
        handleSelectSku(e) {
        if (this.data.skuActive === e.currentTarget.dataset.index) {
            return
        } else {
            this.setData({
            skuActive: e.currentTarget.dataset.index
            })
            this.data.skuList.forEach((el, i) => {
            let skuItem = 'skuList[' + i + '].active'
            this.setData({
                [skuItem]: false
            })
            })
            let skuItem = 'skuList[' + this.data.skuActive + '].active'
            this.setData({
            [skuItem]: true,
            goodsData: this.data.skuList[this.data.skuActive]
            })
        }
        },
        // 编辑数量
        handleEdit(e) {
            if (e.currentTarget.dataset.type === 'minus') {
            // 减一
            if (this.data.buyNum === 1) {
                wx.showToast({
                title:'数量不能少于1',
                icon:'none'
                })
                return
            } else {
                this.setData({
                buyNum: this.data.buyNum - 1
                })
            }
            } else {
            // 加一
            this.setData({
                buyNum: this.data.buyNum + 1
            })
            }
        },
            // 加入购物车
        handlePopupAddCart() {
        var data={
            'tempSpecId':this.data.goodsData.id,
            'commodityId':this.data.goodsData.commodityId,
            'amount':this.data.buyNum,
            'marchantId':this.properties.marchantId,
            'operate':1
        }
        app.sjrequest('/commodity/addTrolley',data).then(res =>{
            if(res.data.code==200){
            wx.showToast({
                title:'添加成功',
                icon:'success'
            })
            }
        })
        },
        //确认下单
        surexf(){
            if(this.data.goodsData.stock==0){
            wx.showToast({
                title:'暂无库存',
                icon:'none'
            })
            return 
            }
            console.log(this.data.orderType)
            let jsonData = {
                marchantId: this.properties.marchantId,
                orderType: this.data.orderType,
                commoditys: [
                {
                    commodityId: this.data.goodsData.commodityId,
                    tempSpecId: this.data.goodsData.id,
                    amount: this.data.buyNum
                }
                ]
            }
            // 使用社交token
            const token = wx.getStorageSync('token')
            app.sjrequest1('/order/onekeyAboutOrder', jsonData, token).then(res => {
                if (res.data.code === 200) {
                    // 更新 store 数据
                    app.store.setState({
                        submitObj: JSON.stringify(res.data.data)
                    })
                    wx.navigateTo({
                        url: '/pages/order/submitOrder/submitOrder'
                    })
                }
            })
            // }
        },
        changeTime(e){
            const {index} = e.currentTarget.dataset
            this.data.saleGoodsList[index].timeData = e.detail
            this.setData({
                saleGoodsList: this.data.saleGoodsList
            });
          },
    },
})
