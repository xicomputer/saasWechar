// pages/Component/add-subtract-num/add-subtract-num.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        defCount:{//默认数量
            type:[String,Number],
            value:1
        },

        desabled:{
            type:Boolean,
            value:false
        }
    },

    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            
        }
    },

    /* 监听数据变化 */ 
    observers:{
        'defCount':function(nowVal){
            this.setData({count:Number(nowVal)});
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        count:1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        minusHandle(){
            this.triggerEvent('minusCount');
            if(this.properties.desabled){return;}
            var count=this.data.count-1;
            if(count<1){
                wx.showToast({title:'最小数量为1',icon:'none'});
            }else{
                this.setData({count},()=>{
                    this.triggerEvent('change',{value:count})
                });
            }
        },

        addHandle(){
            this.triggerEvent('addCount');
            if(this.properties.desabled){return;}
            var count=this.data.count+1;
            this.setData({count},()=>{
                this.triggerEvent('change',{value:count});
            });
        },
    }
})
