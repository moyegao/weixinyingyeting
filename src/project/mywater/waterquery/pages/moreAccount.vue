<template>
  <div class="more-account">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账户多水表</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh @refresh="onRefresh" v-model="isLoading"> -->
          <headerTwo :showData="showData" :title="title"></headerTwo>
          <div class="row kr-buttom" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div class="col-100 kr-list" id="kr-list">
              <list>
                <!-- :checkbox="true" -->
                <list-item @click.native="goBill(item)" v-for="(item,i) in needData" :i="i" :key="item.code">

                  <div class="item-media">

                  </div>
                  <div class="item-content">
                    <div class="item-title-row">
                      <div class="item-title">
                        <span>{{item.userName}}</span>
                        (<span>{{item.userNo}}</span>)
                      </div>
                      <div class="item-title">
                        <span>欠费金额</span>
                      </div>
                    </div>
                    <div class="item-title-row">
                      <div class="item-title">
                        <span style="text-overflow:ellipsis;">{{item.userAddress}}</span>
                      </div>
                      <div class="item-title">
                        <span class="total_num" style="font-size:25px;">{{item.arrears}}元</span>
                      </div>
                    </div>
                  </div>
                  <div class="kr-checkbox" @click="takeChage(i,item)">
                    <input class="checkbox" type="checkbox" name="name" value="A" :id="'checkbox'+i" />
                  </div>
                </list-item>
              </list>
            </div>
            <div class="kr-div"></div>
            <div class="row content-block" v-if="isShowBtn">
              <div class="col-100">
                <m-button size="large" @click.native="pay">确认支付（￥{{count}}）</m-button>
              </div>
            </div>
            <van-dialog v-model="isShowPrice" :title="'确认支付金额￥'+count" show-cancel-button @confirm="comfirm()">
            </van-dialog>
          </div>
        <!-- </van-pull-refresh> -->
      </div>

    </page-content>
  </div>
</template>
<script>
import headerTwo from '@/comments/headerTwo';
import { Dialog } from 'vant';
import { Row, Col } from 'vant'
export default {
  components: {
    headerTwo
  },
  data() {
    return {
      title:'账户多水表',
      //上拉刷新
      isLoading: false,
      scrollTop:0,//滚动条隔顶部的距离

      checked: [],
      count: 0,
      isShowBtn: false,
      isShowPrice: false,
      showData: {
        isShowUL: false,
        isShowLink: false,//是否显示链接
        isShowBtn: true,//是否显示按钮
        ctmName: "",
        accountNo: "",
        accountBalance: '',
        ctmNo: '',
        groupCode: "",
      },
      needData: [],
      order: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.init();
      }, 500);
    },
    scroll(e) {
      if ((parseInt(e.target.clientHeight) + Math.ceil(e.target.scrollTop)) === parseInt(e.target.scrollHeight)) {
        // console.log("到底")
      } else if (e.target.scrollTop == 0) {
        // console.log("到顶")
        e.stopPropagation()
      }
      // this.scrollTop = e.target.scrollTop;
      this.$set(this,'scrollTop',e.target.scrollTop)
    },
    touchmove(e) {
      if(this.scrollTop !== 0){
        e.stopPropagation()//阻止冒泡
      }
    },
    init() {
      // this.showData.userNo = this.$route.query.userNo;
      // this.showData.groupCode = this.$route.query.groupCode;
      let that = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          groupCode: localStorage.getItem('groupCode'),
          accountNo: localStorage.getItem('accNo')
        }
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/accUserList',//接口地址
      }).then(res => {
        that.needData = res.list;
        that.showData.accountBalance = res.accountBalance;
        that.showData.accountNo = res.accountNo;
        that.showData.ctmName = res.ctmName;
        that.showData.ctmNo = res.ctmNo;
        that.showData.groupCode = that.$route.query.groupCode;
        localStorage.setItem('groupOpenId', res.groupOpenId);
      })
    },
    goBill(item) {
      console.log(item);
      event.stopPropagation();
      item.groupCode = this.$route.query.groupCode;
      localStorage.setItem('groupCode', item.groupCode);
      localStorage.setItem('userNo', item.userNo)
      // console.log(item);
      this.$router.push({ path: '/bill', query: item })
    },
    takeChage(i, item) {
      event.stopPropagation();
      let that = this;
      // that.isShowBtn = true;
      // $('#kr-list').css("height",'87%')
      if ($('#checkbox' + i).is(":checked")) {
        that.count += parseFloat(item.arrears);
      } else {
        that.count -= parseFloat(item.arrears)
      }
      if (that.count == 0) {
        $('#kr-list').css("height", '100%')
        that.isShowBtn = false;
        return
      }
      let num = [];
      for (let j = 0; j < that.needData.length; j++) {
        if ($('#checkbox' + j).is(":checked")) {
          num[j] = 1;
        } else {
          num[j] = 0;
        }

      }

      let temp = new Set(num);
      if (temp.has(1)) {
        // &&that.count !== 0
        $('#kr-list').css("height", '85%')
        that.isShowBtn = true;
      } else {
        $('#kr-list').css("height", '100%')
        that.isShowBtn = false;
      }

      // console.log(that.count);
      // that.count -= parseInt(that.showData.pirce);
      // if(that.count<0){
      //   that.count = 0;
      // }
    },
    pay() {
      this.isShowPrice = true;
    },
    comfirm() {
      // console.log(this.count);
      let that = this;
      console.log(that.count);
      if (that.count == 0) {
        let message = '充值金额不能为零！';
        Toast.fail(message);
      } else {
        let params = {//接口入参
          data: {
            groupCode: localStorage.getItem('groupCode'),
            accountNo: localStorage.getItem('userNo'),
            payType: 1,//1 微信直接支付 2 扫码支付
            payMoney: Number(that.count),
            feeType: 1,
            openId: localStorage.getItem('openId'),
            groupOpenId: localStorage.getItem('groupOpenId'),
            isPrestore:0,
          }
        }
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
          // let url = that.$api.getUrl();
          // history.pushState(null, null, url + '/?')
          that.onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign)
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
        console.log(payStatus);
        if (payStatus == '1') {
          // message = '正在处理中，请稍后再试。';
          message = '支付失败！';
          Toast.fail(message);
          // that.getOrder(that.order)
        } else if (payStatus == '2') {
          message = '支付成功！';
          Toast.success(message);
          that.init();
          // that.moduleAccess();
        } else if (payStatus == '3' || payStatus == '4') {
          message = '支付失败！';
          Toast.fail(message);
        }
      })
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
    log(m) {
      console.log(m || 'log')
    }
  }
}
</script>

<style scoped lang="less">
.more-account {
  height: 100%;
  .kr-buttom {
    // padding:2%;
    #kr-list {
      // box-shadow: 1px 1px 5px 1px #888;
      .van-row {
        padding: 1%;
        border-bottom: 1px solid #888;
        .van-col {
          height: 100%;
          .item-title-span {
            padding: 3% 0 0 0;
            height: 100%;
            width: 100%;
            .kr-span {
              display: inline-block;
              height: 100%;
              line-height: 100%;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .item-title {
            // font-family: PingFang_Regular;
            font-weight: 300;
          }
        }
        .kr-checkbox {
          padding: 4% 0 0 0;
          input[type="checkbox"] + label {
            display: block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            // position: absolute;
            // background: rgba(240, 84, 77, 1);
            border: 1px solid red;
          }
          input[type="checkbox"]:checked + label::before {
            display: block;
            content: "\2714";
            text-align: center;
            font-size: 20px;
            color: red;
          }

          input[type="checkbox"] {
            width: 30px;
            height: 30px;
            // visibility: hidden;
          }
        }
      }
    }
  }

  #kr-list {
    // padding:2%;
    // .kr-list-div{
    //   box-shadow: 1px 1px 5px 1px #888;
    //   .kr-body{
    //     .kr-list-body{
    //       border-bottom:1px solid #888;
    //       display: flex;
    //       width: 100%;
    //       padding:1%;
    //       .kr-list-right{
    //         width: 64%;
    //         // .item-title{
    //         //   display: inline-block;
    //         // }
    //       }
    //       .kr-list-middle{
    //         width: 28%;
    //         // .item-title{
    //         //   display: inline-block;
    //         // }
    //       }
    //       .kr-list-left{
    //         width: 8%;
    //       }
    //     }
    //   }
    // }
  }
  .page-content {
    height: 100%;
    .content-padded {
      height: 100%;
      .kr-buttom {
        height: 70%;
        // overflow-y:auto;
        .kr-list {
          height: 85%;
          height: 100%;
          overflow-y: auto;
          width: 100%;
          .item-content {
            margin-left: 0;
            padding-right: 0;
            width: 88%;
          }
          .kr-checkbox {
            width: 6%;
            padding: 10% 0%;
            .checkbox {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: inline-block;
            }
          }
        }
        .kr-div {
          // height: 2%;
        }
        .content-block {
          height: 13%;
          padding: 2% 0 0 4%;
        }
      }
    }
  }
  .pay_box {
    // padding: 6px;
    padding: 1%;
    text-align: right;
    margin-top: 142%;
    a {
      display: inline-block;
      color: #1e1f6a;
      font-weight: bolder;
      .button {
        border-radius: 0.2rem !important;
        // font-family: PingFang_Bold;
        font-weight: 600;
      }
    }
  }
  .icon {
    width: 38px;
    height: 38px;
    position: absolute;
    right: 0.5rem;
  }
  .content-padded {
    margin: 0;
  }
  .list .item-subtitle {
    font-size: 14px;
  }
  .img_content {
    height: 10rem;
    width: 100%;
    background: url("../../../../../static/img/shuidi.png") no-repeat;
    background-size: 100% 100%;
    margin-left: 0;
  }
  .total_num {
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    font-size: 20px;
  }
  .content-block {
    .col-100 {
      text-align: center;
    }
    a {
      font-size: 0.9rem;
      height: 2rem;
      line-height: 2rem;
      width: 60%;
      display: inline-block;
    }
  }
  .list {
    margin: 0;
  }
  // [data-v-594b8ba6]
  .content-block a {
    font-size: 0.9rem;
    height: 2.7rem;
    line-height: 2.7rem;
    width: 92%;
    display: inline-block;
    border-radius: 4px;
    background: #479eff;
    // position: fixed;
    // bottom: 2%;
    // left: 4%;
  }
  .item-title-row {
    // font-family: PingFang_Medium;
    font-size: 15px;
    // height: 2.1rem !important;
    // width: 80%;
    width: 95%;
  }

  .col-100 {
    /*font-size: 14px;*/
    /*		color: red;*/
    .user-card {
      border-radius: 10px;
      padding-top: 3px;
      // font-family: PingFang_Light;
      font-weight: 100;
      // background: url('../../../../project/assets/img/sfcj-bg.png') no-repeat;
      //  background-size:100%;
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
      }
      .card-header {
        .img {
          float: left;
        }
        a {
          float: right;
          color: #fff;
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        // padding-top: 10px;
        .kr-ul {
          margin-top: 6%;
          width: 100%;

          li {
            color: #fff;
            // padding: 10px 7px;
            padding: 1.5% 1%;
            font-weight: 300;

            b {
              font-weight: 300;
            }
            font-size: 14px;
            a {
              display: inline-block;
              color: #3193f6;
              float: right;
            }
          }
        }
      }
    }
    .money-select {
      margin: 0.5rem;
      &:after {
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      li {
        float: left;
        width: 27%;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        margin: 3%;
        background: #e7e7e7;
        border-radius: 6px;
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
}
</style>