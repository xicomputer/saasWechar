// pages/Index/shopHome/components/addWeChat/addWeChat.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId:{
            type:[String,Number],
            value:1
        }
    },

    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            this.getTempClass();
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        contentText:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getTempClass(){
            var tempId=this.properties.tempId;
            var contentText='';
            switch(tempId){
                case '1': case '3': case '12': 
                    contentText='content-text1';break;
                case '2': contentText='content-text2';break;
                case '4': contentText='content-text3';break;
                case '5': case '6': contentText='content-text4';break;
                case '7': contentText='content-text5';break;
                case '8': contentText='content-text6';break;
                case '9': contentText='content-text7';break;
                case '10': contentText='content-text8';break;
                default : contentText='content-text9';
            }

            this.setData({contentText});
        },
        addWXchat(){
            let that = this
            let merchantId = wx.getStorageSync('merchantId')
            app.sjrequest('/marchant/selectGroupQr',{merchantId}).then(res=>{
                that.triggerEvent("showCode",res.data.data)
            })
        }
    }
})
