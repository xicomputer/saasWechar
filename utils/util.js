//  获取当前时间
function getCurrentTime() {
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate
}
// 时间戳转换为时间
function formatStampDate(value) {
    var date = new Date(value);
    var y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      i = date.getMinutes(),
      s = date.getSeconds();
    if (m < 10) { m = '0' + m; }
    if (d < 10) { d = '0' + d; }
    if (h < 10) { h = '0' + h; }
    if (i < 10) { i = '0' + i; }
    if (s < 10) { s = '0' + s; }
    var t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
    return t;
  }

//格式化时间
function formatTime(data) {
    const datatime = data.substring(0, 4) + "/" + data.substring(5, 7) + "/" + data.substring(8, 10) + " " + data.substring(11, 13) + ":" + data.substring(14, 16)

    const date = new Date(datatime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    const now = new Date()
    const milliseconds = now - date
    var timeSpanStr = ""

    if (milliseconds <= 1000 * 60 * 1) {
        timeSpanStr = '刚刚'
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
    } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
    } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
    } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
        timeSpanStr = [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    } else {
        timeSpanStr = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    }

    return timeSpanStr
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatNowDate(datatime) {
    const date = new Date(datatime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, seconds].map(formatNumber).join(':')
}

function formatDate(data) {
    return data.substring(0, 4) + "-" + data.substring(5, 7) + "-" + data.substring(8, 10)
}

function formatDateTime(data) {
    return data.substring(0, 4) + "-" + data.substring(5, 7) + "-" + data.substring(8, 10) + " " + data.substring(11, 13) + ":" + data.substring(14, 16)
}

function formatDateTime2(data) {
    return data.substring(0, 4) + "." + data.substring(5, 7) + "." + data.substring(8, 10) + " " + data.substring(11, 13) + ":" + data.substring(14, 16)
}

function formatTimeSec(data) {
    return data.substring(0, 4) + "-" + data.substring(5, 7) + "-" + data.substring(8, 10) + " " + data.substring(11, 13) + ":" + data.substring(14, 16) + ":" + data.substring(17, 19)
}

function buttonClicked(self) { // 防止重复点击   在需要使用的页面添加参数buttonClicked，通过判断buttonClicked的状态来控制能否点击
    self.setData({
        buttonClicked: true
    })
    setTimeout(function () {
        self.setData({
            buttonClicked: false
        })
    }, 500)
}
module.exports = {
    formatTime: formatTime,
    formatTimeSec: formatTimeSec,
    formatDateTime: formatDateTime,
    formatDateTime2: formatDateTime2,
    formatDate: formatDate,
    buttonClicked: buttonClicked,
    formatNowDate: formatNowDate,
    getCurrentTime,
    formatStampDate
}