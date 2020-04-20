<template>
  <!-- 多户 -->
  <div class="water-query" v-if="$store.state.moreUserShow == 2">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>水费查缴</header-title>
    </page-header> -->
    <!-- 多用户水费查缴 -->

    <page-content>
      <div class="content-padded">
        <van-pull-refresh @refresh="onRefresh" v-model="isLoading">
          <!-- <myHeader :isShow='isShow' :title='title'></myHeader> -->
          <headerThree :message='message'></headerThree>
          <div class="row bottom_content" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
              <van-cell > -->
            <div class="col-100" v-for="(item,i) in needData" :key="item.code" :i="i">
              <div class="yh-content" @click="goMoreAccount(item)">
                <div class="yh-contentR">
                  <div class="yh-div">
                    <span class="kr-title">所属地区：</span>
                    <span class="kr-title">{{item.groupArea}}</span>
                  </div>
                  <div class="yh-div">
                    <span>{{item.ctmName}}</span>
                    (<span>{{item.ctmNo}}</span>)
                  </div>
                  <div class="yh-div">
                    <span>账户编号：</span>
                    <span>{{item.accountNo}}</span>
                  </div>
                </div>
                <div class="yh-contentL">
                  <div class="yh-contentL-left">
                    <div class="yh-div">
                      <span>水表数量：</span>
                      <span>{{item.meterCount}}</span><span>台</span>
                    </div>
                    <div class="yh-div">
                      <span>账户余额：</span>
                      <span>{{item.accountBalance}}</span><span>元</span>
                    </div>
                    <div class="yh-div">
                      <span>应缴总额：</span>
                      <span>{{item.totalArrears}}</span><span>元</span>
                    </div>
                  </div>
                  <div class="yh-contentL-right">
                    <van-button plain class="moreuser-btn" type="primary" icon="description" @click="pay(item)">
                      充值缴费
                    </van-button>
                  </div>
                </div>
                <van-dialog @click.native="takeDialog()" v-model="isShowPrice" :title="'确认缴费金额￥'+count" :beforeClose="beforeClose" show-cancel-button>
                </van-dialog>
                <confirm :title="'确认 提示'" :content="'解除个人绑定？'" :on-ok="log" ref="confirm"></confirm>
              </div>
            </div>
            <!-- </van-cell>
            </van-list> -->
          </div>
        </van-pull-refresh>

      </div>
    </page-content>
  </div>
  <!-- 单户 -->
  <bill v-else-if="$store.state.moreUserShow == 1"></bill>
  <!-- 未绑定 -->
  <notFound v-else-if="$store.state.moreUserShow == 0"></notFound>
  <!-- 单户下的多水表 -->
  <moreAccount v-else-if="$store.state.moreUserShow == -1"></moreAccount>

</template>

<script>
import bill from './bill'
import notFound from '../../../mywater/notFound'
import myHeader from '@/comments/myHeader';
import headerThree from '@/comments/headerThree';
import moreAccount from './moreAccount';
import { PullRefresh, List, Sticky, Button } from 'vant';
export default {
  components: {
    myHeader, bill, notFound, moreAccount, headerThree
  },
  data() {
    return {
      message: {
        title: "水费查缴",
        span1:"尊敬的"+(localStorage.getItem('nickname') === null? 'XX':localStorage.getItem('nickname')),
        span2: "以下为您已绑定的账户信息",
        isShow: 1,
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      url: '',
      isShow: 1,
      title: "水费查缴",
      isShowPrice: false,
      needData: [],
      count: 0,
      order: '',
      meterCount: '',//水表数量
      groupOpenId: '',
      // localStorage.setItem('moreUser','1') 跳转到路由moreUser 将要显示的单户/多户
      //localStorage.setItem('isMoreUser', '1')  真实的单户/多户 
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    var _this = this
    this.init();
    // this.url = window.location.href;
    this.url = window.location.href.split('#')[0]
    this.BUS.$on('goMoreUser', function (bool) {
      _this.init()
    })
  },
  destroyed() {

  },
  methods: {
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        // window.scrollTo(0,0);
        this.init();
        this.url = window.location.href;
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
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.needData.length) {
          this.finished = true;
        }

      }, 500);
    },
    getNeedData() {//接收从跳转页面带来的参数
      let that = this;
      let data = that.$route.query;
      let str = '';
      for (let i in data) {
        that.needData.push(data[i])
        str += that.needData[i];
      }
      str = str.split('/');
      for (let j = 0; j < str.length; j++) {
        str[j] = JSON.parse(str[j])
      }
      that.needData = str
    },
    getGroupOpenId(str) {
      let _this = this;
      let params = {//接口入参
        "data": {
          userNo: localStorage.getItem('userNo'),
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          frontEndUrl: _this.url + '' + str,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/getOtherAuthorize',//接口地址
      }).then(res => {
        location.href = res;
        localStorage.setItem('groupOpenId', _this.getQueryVariable('groupOpenId'))
      })
    },
    init() {
      // localStorage.getItem('moreUser') == '1' 
      // || sessionStorage.getItem('moreUser') == '1'
      this.$store.state.notFound = 0;
      // if (this.getQueryVariable('groupOpenId') !== null) {
      //   this.$store.state.moreUserShow = 1;
      //   return
      // }
      let that = this;
      let params = {
        "data": {
          "openId": localStorage.getItem('openId'),
        },
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/bindCtmList',//接口地址
      }).then(res => {
        //判断水司groupOpenId是否为空 如果为空 去/getOtherAuthorize 拿
        if (res.length > 1) {// 多户页面
          // localStorage.setItem('isMoreUser', '2')
          that.needData = res;
        } else if (res.length == 1) {// 单户页面
          localStorage.setItem('ctmNo', res[0].ctmNo);
          localStorage.setItem('groupOpenId', res[0].groupOpenId);
          localStorage.setItem('groupCode', res[0].groupCode);
          if (parseFloat(res[0].meterCount) > 1) {
            if (res[0].groupOpenId == '') {
              that.getGroupOpenId('#/moreUser')
              // that.getGroupOpenId('#/moreAccount')
              // that.$store.state.moreUserShow = -1;
              return
            }
            localStorage.setItem('accNo', res[0].accountNo);
            that.$store.state.billData = res;
            that.$store.state.moreUserShow = -1;
          } else if (parseFloat(res[0].meterCount) == 1) {
            // 拿groupOpenId
            if (res[0].groupOpenId == '') {
              that.getGroupOpenId('#/moreUser')
              // that.getGroupOpenId('#/bill')
              // that.$store.state.moreUserShow = 1;
              return
            }
            // localStorage.setItem('isMoreUser', '1')
            that.$store.state.billData = res;
            that.$store.state.moreUserShow = 1;
            // that.moduleAccess('11')
            // that.getUserNo(res[0]);
          }
        } else if (res.length == 0) {// 未绑定页面
          // localStorage.setItem('isMoreUser', '0')
          that.title = '请绑定用户'
          that.$store.state.moreUserShow = 0;
        }
      })
    },
    getUserNo(item) {
      let that = this;
      let groupCode = item.groupCode;
      let accountNo = item.accountNo;
      let openId = localStorage.getItem('openId')
      let params = {//接口入参
        data: {
          groupCode,
          accountNo,
          openId,
        }
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/accUserList',//接口地址
      }).then(res => {
        localStorage.setItem('userNo', res.list[0].userNo);
      })
    },
    // 模块访问
    moduleAccess(moduleId) {
      var _this = this;
      let params = {//接口入参
        "data": {
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          moduleId,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {
        if (moduleId == '13') {
          _this.init()
        }
      })
    },
    log(m) {
      console.log(m || 'log')
    },
    // 开票弹出框关闭前钩子函数
    beforeClose(action, done) {
      event.stopPropagation();
      var _this = this;
      if (action == 'confirm') {
        // _this.common.submit(_this.count)
        console.log(this.count);
        let params = {//接口入参
          data: {
            groupCode: localStorage.getItem('groupCode'),
            accountNo: localStorage.getItem('userNo'),
            payType: 1,
            payMoney: Number(_this.count),
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
          _this.order = res.order;
          // let url = _this.$api.getUrl();
          // history.pushState(null, null, url + '/?')
          _this.onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign)
        })
        // 关闭弹框
        done()
      } else if (action == 'cancel') {
        // 关闭弹框
        done()
      }
    },
    dialogChange() {
      let doc = document.getElementsByClassName('van-overlay')[0];
      console.log(doc);
      doc.onclick = function () {
        event.stopPropagation();
      }
    },
    takeDialog() {
      event.stopPropagation();
      this.dialogChange();
    },
    goMoreAccount(item) {
      let that = this;
      localStorage.setItem('accNo', item.accountNo);
      localStorage.setItem('groupCode', item.groupCode);
      localStorage.setItem('groupOpenId', item.groupOpenId);
      // that.moduleAccess('11')
      //该用户下的水表数量的判断
      if (item.meterCount == 1) {//该用户只有一支水表 跳转至单户缴费
        // that.getUserNo(item) ,query:item
        that.$store.state.billData[0] = item;
        console.log(that.$store.state.billData[0]);
        if (item.groupOpenId == '') {
          that.getGroupOpenId('#/bill');
          return
        }
        that.$router.push({ path: '/bill', query: item })
      } else if (item.meterCount > 1) {//该用户下有多支水表 跳转至多水表界面
        // that.$store.state.moreUserShow = -1;
        that.$store.state.billData[0] = item;
        if (item.groupOpenId == '') {
          that.getGroupOpenId('#/moreAccount');
          return
        }
        that.$router.push({ path: '/moreAccount', query: item })
      }
    },
    goWay(item) {
      console.log(item);
      event.stopPropagation()
      localStorage.setItem('isHide', '0')
      localStorage.setItem('userNo', item.ctmNo);
      localStorage.setItem('groupCode', item.groupCode);
      localStorage.setItem('groupOpenId', item.groupOpenId);
      if (item.groupOpenId == '') {
        this.getGroupOpenId('#/pay');
        return
      } else {
        this.$router.push({ path: '/pay' })
      }
    },
    pay(item) {
      console.log(item);
      // localStorage.setItem('moreUser','2')
      // sessionStorage.setItem('moreUser', '2')
      event.stopPropagation()
      this.count = parseFloat(item.totalArrears) - parseFloat(item.accountBalance);
      this.count = this.count.toFixed(2)
      localStorage.setItem('userNo', item.ctmNo);
      localStorage.setItem('groupCode', item.groupCode);
      // this.groupOpenId = item.groupOpenId;
      localStorage.setItem('groupOpenId', item.groupOpenId);
      if (item.groupOpenId == '') {
        this.getGroupOpenId('#/recharge');
        return
      } else {
        this.$router.push({ path: "/recharge" })
      }
      // this.isShowPrice = true;
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
          that.init();
          // that.moduleAccess('13')
        } else if (payStatus == '3' || payStatus == '4') {
          message = '支付失败！';
          Toast.fail(message);
        }
      })
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
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
// scoped
.water-query {
  // height: 100%;
  .page-content {
    // height: 100%;
    .van-pull-refresh {
      // height: 100%;
      .van-pull-refresh__track {
        // height: 100%;
      }
    }
  }
  .page-content {
    .content-padded {
      margin: 0;
      // height: 100%;
      .bottom_content {
        // height: 70%;
        // overflow-y: auto;
      }
    }
  }
  .van-sticky--fixed {
    height: 100%;
  }
  .add_content {
    display: inline-block;
    position: absolute;
    top: 26.5%;
    right: 10px;
    font-size: 50px;
    color: #fff;
    background: #ed702d;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
  }
  .bottom_content {
    padding: 10px;
    .van-cell {
      padding: 0;
      margin-bottom: 2%;
    }
    .col-100 {
      margin-left: 2%;
    }
    .yh-content {
      box-shadow: 1px 1px 5px 1px #888;
      border-radius: 10px;
      margin-bottom: 2%;
      margin-top: 2%;
      // padding: 10px 20px;
      padding: 2% 3%;
      .yh-contentR {
        .yh-div {
          padding: 5px 0;
          font-size: 16px;
          // font-family: PingFang_Medium;
          .kr-title {
            // font-family: PingFang_Heavy;
            font-weight: bolder;
            word-wrap: break-word;
          }
        }
      }
      .yh-contentL {
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        position: relative;
        .yh-contentL-right {
          position: absolute;
          bottom: 0%;
          right: 0%;
          width: 30%;
        }
        div {
          // padding: 6px 10px;
          // text-align: center;
          border-radius: 5px;
          // color: #fff;
        }
        .yh-cz {
          background: #3193f6;
        }
        .yh-jf {
          background: #ed702d;
          margin-top: 25%;
        }
        .moreuser-btn {
          padding: 0;
          width: 100%;
          text-align: center;
          border-radius: 5px;
          box-shadow: 1px 1px 5px 1px #efefef;
          color: #ed702d;
          // font-size: 0.8rem;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
        }
        .yh-div {
          padding: 5px 0;
          font-size: 16px;
          .kr-title {
            font-weight: bolder;
            word-wrap: break-word;
          }
        }
      }
    }
  }
  .row {
    margin-left: 0%;
  }
}
</style>
