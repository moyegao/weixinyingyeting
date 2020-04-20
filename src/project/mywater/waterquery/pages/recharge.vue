<template>
  <div class="recharge">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>缴费</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <headerTwo :showData="showData"></headerTwo> -->
        <!-- <van-pull-refresh @refresh="onRefresh" v-model="isLoading"> -->
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message='message'></headerThree>
        <div class="kr-bottom" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <div class="kr-list">
            <div class="yh-content" v-if="!isShow">
              <div class="yh-content-top yh-child">
                <!-- count -->
                <span class="yh-child-right yh-child-title">缴费金额</span><span class="yh-child-left yh-child-title yh-child-price">{{showData.totalPay}}元</span>
              </div>
              <div class="yh-content-middle yh-child">
                <div class="yh-child-flex">
                  <span class="yh-child-right">用户编号</span><span class="yh-child-left">{{showData.userNo}}</span>
                </div>
                <div class="kr-child yh-child-flex">
                  <span class="yh-child-right">用户名称</span><span class="yh-child-left">{{showData.userName}}</span>
                </div>
                <div class="kr-child yh-child-flex">
                  <span class="yh-child-right">用户地址</span><span class="yh-child-left">{{showData.userAddr}}</span>
                </div>
              </div>
              <div class="kr-pay-type">
                <span>支付方式</span>
              </div>
              <div class="kr-wx-payed">
                <div class="kr-img">
                  <img src="../../../../../static/img/timg.jpg" alt="">
                  <span>微信支付</span>
                </div>
                <div class="kr-big-cir">
                  <div class="kr-little-cir"></div>
                </div>
              </div>
              <!-- yh-child -->
              <div class="yh-content-bottom">
                <m-button size="large" @click.native="pay" class="pay">确认支付</m-button>
              </div>
            </div>
            <div v-if="isShow" class="yh-changed">
              <img src="../../../../../static/img/gougou.jpg" alt="">
              <span>当前户号水费已缴清</span>
            </div>
            <div class="content-block">
              <m-button size="large" @click.native="goPay" class="payOther">预存水费</m-button>
              <m-button size="large" @click.native="goFastPay" class="other" v-if="isOtherPay">为其他户号缴费</m-button>
            </div>
            <div class="yh-kongge"></div>
            <!-- count -->
            <van-dialog v-model="show" :title="'确认支付￥'+showData.totalPay" show-cancel-button @confirm="comfirm()">
            </van-dialog>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>

<script>
import headerTwo from '@/comments/headerTwo';
import myHeader from '@/comments/myHeader';
import headerThree from '@/comments/headerThree';
import { Toast } from 'vant';
export default {
  components: {
    headerTwo, myHeader, headerThree
  },
  data() {
    return {
      message: {
        title: "缴纳水费",
        span1:"足不出户，轻松缴费",
        span2:"预存水费，用水无忧",
        isShow:'',
      },
      title: '缴费',
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      show: false,
      isShow: false,
      isOtherPay: false,
      isShowSubmit: false,
      showData: {
        isShowUL: true,
        isShowLink: false,//是否显示链接
        isShowBtn: false,//是否显示按钮
        userName: "",
        userCode: "",
        userAddr: "",
        price1: "",
        price2: "",
        price3: "",
      },
      needData: [],
      count: 0,
      url: '',
      goUrl: '',
      order: '',
    }
  },
  // mounted
  created(){
    window.scrollTo(0,0);
    // if (localStorage.getItem('isMoreUser') == '2' && sessionStorage.getItem('moreUser') !== '2') {
    //   sessionStorage.setItem('moreUser', '1')
    // }
    let that = this;
    let query = that.$route.query;
    let url = window.location.href.split('#')[0]
    if (query.type == '1' && localStorage.getItem('groupOpenId') !== 'null') {
      window.name = localStorage.getItem('num');
      if (window.name == '0') {
        window.name = "1";
        localStorage.setItem('num', window.name)
      } else {
        window.name = eval(window.name) + 1;
      }
      if (eval(window.name) > 0) {
        // eval(window.name) > 1
        location.href = url + '#/fastpay'
      }
    }
    this.isShow = query.isShow;
    this.init()
  },
  methods: {
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        // window.scrollTo(0,0);
        this.init();
      }, 500);
    },
    scroll(e) {
      // e.stopPropagation()
      if ((parseInt(e.target.clientHeight) + Math.ceil(e.target.scrollTop)) === parseInt(e.target.scrollHeight)) {
        // console.log("到底")
      } else if (e.target.scrollTop == 0) {
        // console.log("到顶")
        e.stopPropagation()
      }
      // this.scrollTop = e.target.scrollTop;
      this.$set(this, 'scrollTop', e.target.scrollTop)
    },
    touchmove(e) {

      // e.stopPropagation()//阻止冒泡
      if (this.scrollTop !== 0) {
        e.stopPropagation()//阻止冒泡
      }
      // e.preventDefault()//阻止默认事件
    },

    log(m) {
      console.log(m || 'log')
    },
    getGroupOpenId() {
      let _this = this;
      let params = {//接口入参
        "data": {
          userNo: localStorage.getItem('userNo'),
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          frontEndUrl: _this.url,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/getOtherAuthorize',//接口地址
      }).then(res => {
        _this.goUrl = res;
        location.href = _this.goUrl
      })
    },
    goBill(item) {
      console.log(this.showData);
      console.log(item)
      event.stopPropagation();
      // localStorage.setItem('userNo', this.showData.accountNo);
      // localStorage.setItem('groupCode', this.showData.groupCode);
      let query = this.$route.query;
      if (query.type !== '1') {
        this.$router.push({ path: '/bill' })
      }
    },
    goPay() {
      if (this.$route.query.type == '1') {
        localStorage.setItem('isHide', '1')
      } else {
        localStorage.setItem('isHide', '0')
      }
      this.$router.push({ path: '/pay' })
    },
    goFastPay() {
      this.$router.push({ path: '/fastpay' })
    },
    takeChage(i, item) {
      console.log(item);
      event.stopPropagation();
      let that = this;
      if ($('#checkbox' + i).is(":checked")) {
        that.count = parseFloat(that.count)
        that.count += parseFloat(item.totalCost);
      } else {
        that.count = parseFloat(that.count)
        that.count -= parseFloat(item.totalCost)
      }
      that.count = that.count - parseFloat(that.showData.accountBalance);
      if (that.count < 0) {
        that.count = 0;
      }
      that.count = that.count.toFixed(2);
    },
    init() {
      if(this.isShow === true){
        return
      }
      let that = this;
      let query = that.$route.query;
      console.log(query);
      let apiUrl = '';
      // let billStatus = '';
      this.url = window.location.href;
      // this.init()
      if (query.type == '1') {
        this.isOtherPay = false;
        apiUrl = '/myWater/unBindUserBill';
        // billStatus = '3';// 未缴费
        localStorage.setItem('groupOpenId', this.getQueryVariable('groupOpenId'))
        console.log(localStorage.getItem('groupOpenId'));
        //不要删 246-248
        if (localStorage.getItem('groupOpenId') == 'null') {
          this.getGroupOpenId()
          return
        }
      } else {
        this.isOtherPay = true;
        apiUrl = '/myWater/bindUserBill';
        // billStatus = '1';// 查所有
      }
      let userNo = localStorage.getItem('userNo');
      let area = localStorage.getItem('groupCode');
      let data = {
        area,
        billStatus: '3',
        userNo,
      }
      let params = {
        data,
      }

      that.$api.fetch({
        params,//参数
        apiUrl,//接口地址
      }).then(res => {
        that.showData.accountBalance = res.accountBalance;//预存
        that.showData.accountNo = res.accountNo;
        that.showData.groupCode = res.groupCode;
        that.showData.totalArrearage = res.totalArrearage;//欠费
        that.showData.totalPay = res.totalPay;
        that.showData.userAddr = res.userAddr;
        that.showData.userName = res.userName;
        that.showData.userNo = res.userNo;
        that.needData = res.billList;
        //欠费金额是否小于余额
        that.isShowSubmit = parseFloat(res.totalArrearage) < parseFloat(res.accountBalance);
        if (res.billList.length == 0) {
          that.isShow = true;
        } else {
          that.isShow = false;
        }
        that.count = parseFloat(that.count);
        for (let i = 0; i < that.needData.length; i++) {
          that.needData[i].billMonth = that.needData[i].billMonth.toString();
          that.needData[i].month = that.needData[i].billMonth.substring(4, 6);
          that.needData[i].year = that.needData[i].billMonth.substring(0, 4);
          that.count += parseFloat(that.needData[i].totalCost);
        }
        that.count = that.count - parseFloat(res.accountBalance);
        that.count = that.count.toFixed(2);
      })
    },
    comfirm() {
      let that = this;
      let query = that.$route.query;
      console.log(query);
      let params = {//接口入参
        data: {
          groupCode: localStorage.getItem('groupCode'),
          accountNo: localStorage.getItem('userNo'),
          payType: 1,
          payMoney: Number(that.count),
          feeType: 1,
          openId: localStorage.getItem('openId'),
          groupOpenId: localStorage.getItem('groupOpenId'),
          isPrestore:0,
        }
      }
      // alert(localStorage.getItem('groupOpenId'));
      // Toast.success('缴费成功！')
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/wechatPay',//接口地址
      }).then(res => {
        let appId = res.appId;
        let timeStamp = res.timeStamp;
        let nonceStr = res.nonceStr;
        let _package = res.package;
        let signType = res.signType;
        let paySign = res.paySign;
        that.order = res.order;
        that.onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign)
      })
    },
    pay() {
      console.log(this.count);
      let that = this;
      let message = '';
      if (this.count == 0) {
        message = '支付金额不能为零!';
        Toast.fail(message);
      } else {
        that.show = true;
      }

      let num = [];
      for (let i = 0; i < that.needData.length; i++) {
        if ($('#checkbox' + i).is(":checked")) {
          num[i] = 1;
        } else {
          num[i] = 0;
        }
      }
      let temp = new Set(num);
      if (!temp.has(1)) {

      }
    },
    // 模块访问
    moduleAccess() {
      var _this = this;
      let params = {//接口入参
        "data": {
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          moduleId: '13',
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {
        _this.init()
      })
    },
    onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign) {
      let that = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          appId,     //公众号名称，由商户传入     
          timeStamp,         //时间戳，自1970年以来的秒数     
          nonceStr, //随机串     
          package: _package,
          signType,         //微信签名方式：     
          paySign, //微信签名 
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            that.getOrder(that.order)
          }
          // else{
          //   let message = '支付失败！';
          //   Toast.fail(message);
          // }
        }
      );
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
      }
      return (null);
    },
    getOrder(order) {
      let that = this;
      let message = '';
      let params = {//接口入参
        data: {
          // order:"5dce0850d4b2155d7c3eeead",
          order
        }
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/payResultQuery',//接口地址
      }).then(res => {
        let payStatus = res.payStatus;
        if (payStatus == '1') {
          // message = '正在处理中，请稍后再试。';
          message = '支付失败！';
          Toast.fail(message);
          // that.getOrder(that.order)
        } else if (payStatus == '2') {
          message = '支付成功！';
          Toast.success(message);
          that.init()
          // that.moduleAccess()
        } else if (payStatus == '3' || payStatus == '4') {
          message = '支付失败！';
          Toast.fail(message);
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.recharge {
  .content-padded {
    // height: 100%;
    margin: 0;
    .header-two {
      height: 32%;
    }
    .kr-bottom {
      // height: 70%;
      // overflow-y: auto;
      padding: 3% 3%;
      .kr-list {
        height: 100%;
        .yh-content {
          border-radius: 5px;
          height: auto;
          background: #fff;
          box-shadow: 1px 1px 5px 1px #888;
          padding: 3% 3%;
          .kr-pay-type {
            padding: 3% 0%;
            border-bottom: 1px solid #ddd;
            span {
              display: inline-block;
              padding: 1% 0;
              width: 100%;
              font-weight: bold;
            }
          }
          .kr-wx-payed {
            height: 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1% 0%;
            width: 100%;
            .kr-img {
              width: 75%;
              height: 100%;
              display: flex;
              align-items: center;
              img {
                height: 55%;
              }
              span {
                font-weight: bolder;
                display: inline-block;
                margin-left: 1rem;
              }
            }
            .kr-big-cir {
              width: 0.8rem;
              height: 0.8rem;
              background: #207ef3;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              .kr-little-cir {
                width: 0.4rem;
                height: 0.4rem;
                background: #fff;
                border-radius: 50%;
              }
            }
          }
          .yh-child {
            width: 100%;
            .yh-child-flex{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .kr-child {
              padding: 0 0 2% 0;
            }
            span {
              display: inline-block;
            }
            .yh-child-right {
              vertical-align: top;
              text-align: left;
              width: 30%;
              color: #030303;
              font-size: 0.8rem;
            }
            .yh-child-left {
              vertical-align: top;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-break: keep-all;
              width: 70%;
              text-align: right;
              color: #787878;
            }
            .yh-child-title {
              font-size: 0.9rem;
            }
            .yh-child-price {
              color: #ed702d;
            }
          }
          .yh-content-top,
          .yh-content-middle {
            padding: 3% 0%;
            border-bottom: 1px solid #ddd;
          }
          .yh-content-middle div {
            padding: 2% 0;
          }
          .yh-content-bottom {
            // margin-top: 3%;
          }
        }
        .yh-changed {
          height: 40%;
          overflow-y: hidden;
          background: #fff;
          box-shadow: 1px 1px 5px 1px #888;
          padding: 3% 3%;
          background: #f6f6f6;
          text-align: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          flex-direction: column;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          img {
            width: 30%;
          }
          span {
            display: inline-block;
            padding: 2% 0;
          }
        }
        .content-block {
          border-radius: 5px;
          // height: 35%;
          height: auto;
          margin-top: 2%;
          margin-bottom: 2%;
          padding: 3% 3%;
          box-shadow: 1px 1px 5px 1px #888;
          background: #fff;
          .button-default {
            // width: 94%;
            // margin-left: 3%;
            // margin-top: 3%;
          }
          .pay {
          }
          .payOther {
            background: #ed702d;
          }
          .other {
            color: #52a646;
            margin-top: 3%;
            background: #fff;
          }
        }
      }
    }
    .yh-kongge {
      height: 0.5rem;
    }
  }
}
</style>