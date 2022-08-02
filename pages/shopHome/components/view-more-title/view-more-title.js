// pages/shopHome/components/view-more-title/view-more-title.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        addPd: {
            type: [String, Number],
            value: 1
        },
        titleColor: {
            type: String,
            value: ''
        },
        titleSize: {
            type: String,
            value: ''
        },
        imgName: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        subTitle: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgUrl: ''
    },

    // 监听数据
    observers: {
        "imgName": function (nowVal, oldVal) {
            if (nowVal) {
                var imgUrl = `../../imgs/view-more-title-img/${nowVal}`
                this.setData({
                    imgUrl
                });
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        emitEvent() {
            this.triggerEvent('click')
        }
    }
})