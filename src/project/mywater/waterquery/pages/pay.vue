<template>
  <div class="pay">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>充值</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <headerTwo :showData="showData" :title="title"></headerTwo>
        <div class="row kr-body">
          <div class="col-100">
            <div class="pay_title">充值金额</div>
            <div class="pay_input">
              <!-- @blur="outPirce(sumPrice)" -->
              <!-- v-model="sumPrice"  @input="inputPrice(sumPrice)"  -->
              <!-- @keyup='keyup($event)' 
                    @input="inputPrice(price)" -->
                    <!-- @focus="pay()" -->
              <input 
                    @input="inputPrice(price)"
                    class="pay_price" 
                    placeholder="其它金额" 
                    oninput="this.value=this.value.replace(/[^0-9.]+/,'');"
                    v-model="price" 
                    type="number"
                     />
              <span v-if="price !== 0 && price !== ''" class="pay_nomral">转预存金额<span class="pay_num">{{price}}</span>元</span>
              <span v-if="price == 0 || price == ''" class="pay_nomral">转预存金额<span class="pay_num">0</span>元</span>
            </div>
            <ul class="money-select">
              <li @click="takeChange(0)">50元</li>
              <li @click="takeChange(1)">100元</li>
              <li @click="takeChange(2)">150元</li>
              <li @click="takeChange(3)">200元</li>
              <li @click="takeChange(4)">500元</li>
              <li @click="takeChange(5)">1000元</li>
              <!-- <li style="color: #989898;">
                <input placeholder="其他金额" v-model="sumPrice" class="kr-input" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" @focus="pay()" type="number" @blur="outPirce(sumPrice)" @input="inputPrice(sumPrice)">
              </li> -->
            </ul>
            <van-dialog v-model="show" title="请输入金额" show-cancel-button @confirm="comfirm(0)">
              <van-field v-model="sumPrice" placeholder="请输入金额(最大金额不能超过100万!)" type="number" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" @input="inputPrice(sumPrice)" />
            </van-dialog>
            <van-dialog v-model="showPice" :title="'确认支付（￥'+price+'）'" show-cancel-button @confirm="comfirm(1)">
            </van-dialog>
          </div>
        </div>
        <p class="care">注意:充值后如有欠费将自动扣除</p>
        <div class="kr-kongge"></div>
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
        <div class="row content-block">
          <div class="col-100">
            <!-- <p class="care">注意:充值后如有欠费将自动扣除</p> -->
            <m-button size="large" class="zero-pay" v-if="price == 0">确认支付（￥0）</m-button>
            <m-button size="large" @click.native="submit()" v-else>确认支付（￥{{price}}）</m-button>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>
<script>
import headerTwo from '@/comments/headerTwo';
import { Dialog, Field, Toast, PullRefresh, List, RadioGroup, Radio } from 'vant';
export default {
  components: {
    headerTwo
  },
  data() {
    return {
      title: '充值',
      //上拉刷新
      isLoading: false,

      show: false,
      showPice: false,
      showData: {
        isShowUL: true,
        isShowLink: false,//是否显示链接
        isShowBtn: false,//是否显示按钮
        accountBalance: "",
        accountNo: "",
        ctmAddress: "",
        ctmName: "",
        ctmNo: "",
        totalArrears: "",
        totalPay: "",
      },
      otherPrice: '',
      price : "",
      sumPrice: "",
      order: '',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.init();
      }, 500);
    },
    init() {
      let that = this;
      let isHide = '0';
      if (localStorage.getItem('isHide') == '1') {
        isHide = '1'
      }
      let params = {//接口入参
        "data": {
          groupCode: localStorage.getItem('groupCode'),
          accountNo: localStorage.getItem('userNo'),
          openId: localStorage.getItem('openId'),
          isHide,//已绑定 传"0" 未绑定 传"1"
        }
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/ctmRechangeInfo',//接口地址
      }).then(res => {
        that.showData.accountBalance = res.accountBalance;
        that.showData.accountNo = res.accountNo;
        that.showData.ctmAddress = res.ctmAddress;
        that.showData.ctmName = res.ctmName;
        that.showData.ctmNo = res.ctmNo;
        that.showData.totalArrears = res.totalArrears;
        localStorage.setItem('groupOpenId', res.groupOpenId);
        that.showData.totalPay = res.totalPay;
        that.takeChange(3)
      })
    },
    takeChange(i) {
      let that = this;
      switch (i) {
        case 0:
          that.price = '50';
          that.sumPrice = 50;
          break;
        case 1:
          that.price = '100';
          that.sumPrice = 100;
          break;
        case 2:
          that.price = '150';
          that.sumPrice = 150;
          break;
        case 3:
          that.price = '200';
          that.sumPrice = 200;
          break;
        case 4:
          that.price = '500';
          that.sumPrice = 500;
          break;
        case 5:
          that.price = '1000';
          that.sumPrice = 1000;
          break;
        default:
      }
      $(".money-select li").eq(i).addClass("active").siblings().removeClass('active')
    },
    keyup(e) {
      console.log(e.keyCode);
      if(this.price == '0'){
        this.price = '';
      }
      console.log(this.price)
      if (e.keyCode == '45') {
        console.log('1111');
        this.price = '0';
      }
    },
    inputPrice(num) {
      $(".money-select li").removeClass('active')
      if (parseFloat(num) > 0 && parseFloat(num) <= 1000000) {
        if (/^([0-9]*\.[0-9]*)$/.test(num)) {
          let message = '充值不能为小数！';
          Toast.fail(message);
          // this.sumPrice = '';
          this.price = '';
        } else if (/^(0[1-9]*)$/.test(num)) {
          // this.sumPrice = num.slice(1);
          this.price = num.slice(1);
        } else {
          // this.sumPrice = num;
          this.price = num;
        }
      } else if (parseFloat(num) < 0) {
        let message = '充值不能为负数！';
        Toast.fail(message);
        // this.sumPrice = '';
        this.price = '';
      } else if (parseFloat(num) > 1000000) {
        let message = '充值不能超过100万！';
        Toast.fail(message);
        // this.sumPrice = 999999;
        this.price = 999999;
      } 
      else if (/^\.[0-9]*$/.test(num)) {
        let message = '充值不能为小数！';
        Toast.fail(message);
        // this.sumPrice = '';
        this.price = '';
      } else if (num == '') {
        // this.sumPrice = 0;
        this.price = '';
      }
      // this.price = this.sumPrice;
    },
    outPirce(num) {
      if (parseFloat(num) < parseFloat(this.showData.totalArrears)) {
        let message = '充值金额不能小于欠费金额！';
        Toast.fail(message);
        // this.price = 0;
      }
      // this.sumPrice = '';
    },
    pay() {
      // this.sumPrice = '';
      // this.price = 0;
      $(".money-select li").removeClass('active')
      // this.show = true;
    },
    comfirm(i) {
      if (i == 0) {
        if (this.sumPrice == '') {
          this.price = 0;
        } else {
          this.price = this.sumPrice;
        }
      } else if (i == 1) {
        // this.onBridgeReady();
        let that = this;
        console.log(that.price);
        let params = {//接口入参
          data: {
            groupCode: localStorage.getItem('groupCode'),
            accountNo: localStorage.getItem('userNo'),
            payType: 1,//1 微信直接支付 2 扫码支付
            payMoney: Number(that.price),
            feeType: 1,
            openId: localStorage.getItem('openId'),
            groupOpenId: localStorage.getItem('groupOpenId'),
            isPrestore:1,
          }
        }
        // Toast.success('充值成功！')
        // alert(localStorage.getItem('groupOpenId'));
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
          //记录查询开始时间3s内 在这继续调用 拿到接口就调 就是这个。 主要是这个。
          // setTimeout(() => {
          //   that.getOrder(that.order)
          // }, 3000);
          // that.getOrder(that.order)
        })
      }

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
            //记录查询开始时间3s内 在这继续调用 拿到接口就调 就是这个。
            that.getOrder(that.order)
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
          // else{
          //   let message = '支付失败！';
          //   Toast.fail(message);
          // }
        }
      );
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
          //防止这个。一次不成功 就来第二次 在三秒中内程序调用多次 三秒外 用户自己重新再调 要做成这样的功能 我还没写
          // let timer = setInterval(() => {
          //   that.getOrder(order)//那就难搞了
          // }, 500);
          // clearInterval(timer)
          // message = '正在处理中，请稍后再试。';
          message = '支付失败！';
          Toast.fail(message);
          // that.getOrder(that.order)
        } else if (payStatus == '2') {
          message = '支付成功！';
          Toast.success(message);
          that.init();
          // that.moduleAccess()
        } else if (payStatus == '3' || payStatus == '4') {
          message = '支付失败！';
          Toast.fail(message);
        }
      })
    },
    // if (typeof WeixinJSBridge == "undefined"){
    //   if( document.addEventListener ){
    //       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    //   }else if (document.attachEvent){
    //       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
    //       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    //   }
    // }else{
    //   onBridgeReady();
    // }
    submit() {
      if (this.price == 0) {
        let message = '充值金额不能为零！';
        Toast.fail(message);
        this.showPice = false;
      }else if (parseFloat(this.sumPrice) < parseFloat(this.showData.totalArrears) || parseFloat(this.price) < parseFloat(this.showData.totalArrears)) {
        let message = '充值金额不能小于欠费金额！';
        Toast.fail(message);
        this.sumPrice = '';
        // this.price = 0;
      }
      else {
        setTimeout(() => {
          window.scrollTo(0, 0)
          this.showPice = true;
        }, 1000);
      }
      console.log(this.price);
    },
    // 模块访问
    moduleAccess() {
      var _this = this;
      let params = {//接口入参
        "data": {
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          moduleId: '12',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {
        _this.init()
        history.go(-1)//返回到上一页
      })
    },
  }
}
</script>

<style scoped lang="less">
.pay {
  .page-content {
    height: 100%;
  }
  .kr-pay-type {
    background: #fff;
    padding: 3% 5%;
    border-bottom: 1px solid #f5f5f5;
    border-radius: 5px 5px 0 0;
    span {
      display: inline-block;
      padding: 1% 0;
      width: 100%;
      font-weight: bold;
    }
  }
  .kr-wx-payed {
    border-radius: 0px 0px 5px 5px;
    background: #fff;
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1% 5%;
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
      width: 25%;
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
  .content-padded {
    background: #efefef;
    margin: 0;
    // height: auto;
    height: 100%;
    .header-two {
      height: auto;
      padding: 0 0 3% 0;
    }
    .kr-body {
      height: auto;
      background: #fff;
    }
  }
  .pay_title {
    height: 30px;
    line-height: 30px;
    width: 50%;
    margin-top: 3%;
    margin-left: 4%;
    font-weight: bold;
  }
  .pay_input {
    padding: 3% 4% 1% 4%;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    .pay_price {
      border: 0;
      width: 50%;
      font-size: 0.7rem;
      border-bottom: 1px solid #ddd;
    }
    .pay_nomral {
      width: 50%;
      font-size: 0.7rem;
      text-align: right;
      .pay_num {
        color: red;
      }
    }
  }
  .kr-kongge {
    height: 0.5rem;
    width: 100%;
    background: #efefef;
  }
  .care {
    background: #fff;
    color: #ec722f;
    // font-family: PingFang_Bold;
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    padding: 1% 0;
    border-radius: 0px 0px 5px 5px;
  }
  .content-block {
    padding: 2% 4%;
    background: #efefef;
    margin-left: 0;
    .zero-pay {
      background: #8d99a5;
    }
    width: 100%;
    .col-100 {
      text-align: center;
      margin-left:0;
      width: 100%;
    }
    a {
      font-size: 0.9rem;
      height: 2.6rem;
      line-height: 2.6rem;
      width: 92%;
      display: inline-block;
      border-radius: 3px;
      background-color: #479eff;
      // font-family: PingFang_Medium;
    }
  }
  .col-100 {
    .money-select {
      // margin: 0 0.5rem 0.5rem 0.5rem;
      margin: 0 1% 1% 1%;
      &:after {
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      li {
        background: #efefef;
        float: left;
        width: 27%;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        margin: 3%;
        border-radius: 3px;
        font-size: 0.7rem;
        color: #8d99a5;
        .kr-input {
          width: 100%;
          height: 100%;
          text-align: center;
          color: #000;
        }
      }
    }
    p {
      text-align: center;
      margin: 0.5rem;
    }
    h3 {
      padding: 0.5rem;
    }
  }
  .active {
    border: 2px solid #479eff !important;
    // background: #479eff;
    color: #479eff !important;
  }
}
</style>