let app=getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId:{
            type:[String,Number],
            value:1
        },
        marchantId: {
            type: String,
            value: ''
        },
        orderSwitch:{
            type:[Number, String]
        },
        countdown: {
            type: Boolean,
            value: false
        },
        templateTag:{// TJFL推荐返利 JSMS秒杀活动 TTPT拼团
            type:String,
            value:'',
        }
    },

    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            var templateTag=this.properties.templateTag;
            var activityLog='';
            if(templateTag=='JSMS'){
                activityLog='../../../../image/tabpage/c6_btn.png';
            }else if(templateTag=='TTPT'){
                activityLog=''
            }
            this.setData({activityLog});
            this.getDataList();
        }
    },
    
    /**
     * 组件的初始数据
     */
    data: {
        tempId:1,
        productList:[],
        currentIndex:0,
        JifentimeData: {},
        footImg:'/pages/static/foot_Img.png',

        activityLog:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        changeJfTime(e){
            var detail = e.detail;
            var subs=e.currentTarget.dataset.subs;
            var productList=this.data.productList;
            var [index,ti] = subs.split('-');
            for(var key in detail){
                var value=detail[key];
                detail[key]=value<10?('0'+value):value;
            }
            productList[index].activityList.list[ti].downTime=detail;
            this.setData({productList});
        },

        titleClick(e){
           this.setData({
                currentIndex:e.currentTarget.dataset.idx
            });
        },

        toGoodsDetails(e) {
            var item=e.currentTarget.dataset.item;
            var activityId=item.activityId;
            var type=item.templateTag;
            var url='';
            if(type=='JSMS'){
                url='/pages/seckill/detail/detail?activityId='+activityId;
            }else if(type=='TTPT'){
                url='/pages/group_booking/detail/detail?activityId='+activityId;
            }
            wx.navigateTo({url});
        },
        navito(e) {
            const {name, id} = e.currentTarget.dataset
            wx.navigateTo({
              url: `/pages/Index/GoodsList/GoodsList?category=${name}&marchantId=${this.data.marchantId}&classifyId=${id}`
            })
        },
        goColumn(e){
            var item = e.currentTarget.dataset.item;
            var {id,templateTag} = item;
            var url='/pages/shopHome/activity_classity_list/activity_classity_list';
            url+='?classid='+id+'&type='+templateTag;
            wx.navigateTo({url});
        },

        _parseDate(str,resType) { //resType 取值 'object' | 'number'
            var a = str.split(/[^0-9]+/);
            var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
            return resType == 'number' ? date.getTime() : date;
        },

        getDataList(){
            var tempId=this.properties.tempId;
            var templateTag=this.properties.templateTag;
            var reqData={
                pageSize:30, currentPage:1,
                merchantId:this.properties.marchantId,
            }
            tempId>4 && (reqData.templateTag=templateTag);
            app.sjrequest1('/activityCommodityBusiness/commodityClassifyPageList',reqData).then(res=>{
                if(res.statusCode && res.data.code===0){
                    var data=res.data.data || {};
                    var list=data.list || [];
                    list.forEach(item=>{
                        item.activityList || (item.activityList={});
                        var activityList=item.activityList;
                        activityList.list || (activityList.list=[]);
                        var productList=activityList.list || [];
                        productList.forEach(temp=>{
                            var nowTimes=new Date().getTime();
                            var endTimes=this._parseDate(temp.endTime,'number');
                            var diffTimes=endTimes-nowTimes;
                            temp.downDiffTimes=diffTimes;
                            temp.downTime={days:'',hours:'',minutes:'',seconds:''};
                            
                            var skuList=temp.activityCommoditySkuList || [];
                            var skuItem1=skuList[0] || {};
                            temp.imageUrl=temp.bannerImgUrls[0];
                            temp.price=skuItem1.price;
                            temp.lowPrice=skuItem1.livePrice;
                        })
                    })
                    this.setData({productList:list});
                }
            })
        },
    }
})
