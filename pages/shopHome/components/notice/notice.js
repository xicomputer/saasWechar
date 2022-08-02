// pages/Index/shopHome/components/notice/notice.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId:{
            type:[String,Number],
            value:1
        },
        list: {
            type: Array,
            value: []
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
        noticeBox:'',
        contentBox:'',
        textColor:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getTempClass(){
            var tempId=this.properties.tempId+"";
            var noticeBox='',contentBox='',textColor='';
            switch(tempId){
                case '1': noticeBox='notice-box1';break;
                case '2': noticeBox='notice-box1';break;
                default : noticeBox='';
            }
            switch(tempId){
                case '3': case '5': case '6': 
                case '8': case '9': case '10': 
                    contentBox='content-box1';break;
                default : contentBox='';
            }

            switch(tempId){
                case '1': case '2': case '3': case '4':
                    textColor='text-color1';break;
                case '5': case '6': case '7': 
                    textColor='text-color2';break;
                case '9': textColor='text-color3';break;
                case '10': textColor='text-color4';break;
                default : textColor='';
            }

            this.setData({noticeBox,contentBox,textColor});
        }
    }
})
