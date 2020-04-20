'use strict'
import Vue from 'vue'
import main from '../../../src/main'
import http from './http'

let common = {}

// 模块访问公共方法
common.moduleAccess = (moduleId, that, _then) => {
  var _this = that;
  let params = {
    "data": {
      "openId": localStorage.getItem('openId'),
      'moduleId': moduleId,
    },
  }
  _this.$api.fetch({
    params: params,
    apiUrl: '/common/moduleVisitAdd',
  }).then(res => {
    _then()
  })
}
// 操作公共方法
common.operationAccess = (data, that, _then) => {
  var _this = that;
  let params = {
    "data": {
      "openId": localStorage.getItem('openId'),
      'id': data.id,
      'operaId': data.operaId,
      'groupCode': data.groupCode,
      'result': data.result,
      'failReason': data.failReason,
      'time': data.time,
    },
  }
  _this.$api.fetch({
    params: params,
    apiUrl: '/common/operationAdd',
  }).then(res => {
    _then()
  })
}

//将水司编号转换为两位数 如 0101C0102 => 010101
common.transCode = (list) => {
  let i = 1;
  let newList = {}
  let newKey = '';
  for (let key in list) {
    if (i < 10) {
      i = '0'+i;
    }
    newKey = key.slice(0, 4) + i;
    newList[newKey] = list[key]
    i++
  }
  return newList
}

//将两位数 反转换为 水司编号 key value '0101C00001'
common.codeTrans = (groupCode, list) => {
  let i = 1;
  for (let key in list) {
    if (parseInt(groupCode) == i) {
      groupCode = key.slice(4)
    }
    i++
  }
  return groupCode
}

//将水司编号转换为两位数 如 01C0102 => 010100
common.transCodeCity = (list) => {
  let i = 1;
  let newList = {}
  let newKey = '';
  for (let key in list) {
    if (i < 10) {
      i = '0'+i;
    }
    newKey = key.slice(0, 2) + i + '00';
    newList[newKey] = list[key]
    i++
  }
  return newList
}

//将两位数 反转换为 水司编号 key value '0101C00001'
common.codeTransCity = (groupCode, list) => {
  let i = 1;
  for (let key in list) {
    if (parseInt(groupCode.slice(0,2)) == i) {
      groupCode = key.slice(2)
    }
    i++
  }
  return groupCode
}

// 调用支付接口
function onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
      appId,     //公众号名称，由商户传入     
      timeStamp, //时间戳，自1970年以来的秒数     
      nonceStr, //随机串     
      package: _package,
      signType,//微信签名方式：     
      paySign, //微信签名 
    },
    function (res) {
      console.log(res);
      alert(res)
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      } else {
        let message = '支付失败！';
        Toast.fail(message);
      }
    }
  );
}

common.submit = (payMoney) => {
  let that = this;
  let params = {//接口入参
    data: {
      groupCode: localStorage.getItem('groupCode'),
      accountNo: localStorage.getItem('userNo'),
      payType: 1,//1微信直接支付，2微信二维码支付
      payMoney,//支付金额
      feeType: 1,
      openId: localStorage.getItem('openId'),
      groupOpenId: "oPOvYt3q-Ac9dK1SsEHZF9DDOZnY"
    }
  }
  that.$api.fetch({
    params,//参数
    apiUrl: '/myWater/wechatPay',//接口地址
  }).then(res => {
    let appId = res.appId;
    let timeStamp = res.timeStamp;
    let nonceStr = res.nonceStr;
    let _package = res.package;
    let signType = res.signType;
    let paySign = res.paySign;
    onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign)
  })
}

//公司组织树默认点中已绑定的公司
//incode 已绑定公司的groupCode
//countylist 区的列表
//citylist 市的列表
//areanum vant默认点击所需的值
common.companyTree = (incode, countylist, citylist, areanum) => {
  for (const key in countylist) {//区
    let groupCode = key.slice(4)
    if (incode == groupCode) {
      areanum = key;
    } else {
      for (const item in citylist) {//市
        let code = item.slice(2)
        if (incode == code) {
          areanum = item;
        }
      }
    }
  }
  return areanum;
}

export default common