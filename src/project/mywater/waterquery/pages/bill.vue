<template>
  <div class="bill">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账单</header-title>
    </page-header> -->
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" ref="bill"> -->
        <headerTwo :showData="showData" :title="title" ref="headerTwo"></headerTwo>
        <!-- @touchmove="touchmove($event)" @scroll="scroll($event)" -->
        <div v-if="!isShow" class="kr-div_show">
          <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
            <van-cell > -->
          <div class="kr-bill-parent">
            <div class="kr-bill" v-for="(item,i) in needData" :key="item.code" :i="i" @click="pay($event, item.billStatus)">
              <div class="kr-bill-top" :class="item.billStatus == 0?'':'active'">
                <span class="bill-title">用水时间:</span>
                <span class="bill-time bill-time1">{{item.startDate}}</span>
                <div class="bill-slot"></div>
                <span class="bill-time bill-time2">{{item.endDate}}</span>
              </div>
              <div class="kr-bill-bottom">
                <div class="kr-bill-bottom-content bill-top">
                  <span class="bill-top-left">{{item.totalCost}}元</span>
                  <span class="bill-top-right" :class="item.billStatus == 0?'':'active'">{{item.billStatus == 0?'未缴清':'已缴清'}}</span>
                </div>
                <div class="kr-bill-bottom-content bill-middle">
                  <span>{{item.curWaterNum}}吨</span>
                </div>
                <div class="kr-bill-bottom-content bill-bottom">
                  <div class="bill-bottom-btn" @click.stop="takeChange(item)">
                    <img src="../../../../../static/img/zhangdan(11).png" alt="">
                    <span>详情</span>
                  </div>
                  <div class="bill-bottom-btn kr-no-pay" v-if="item.billStatus == 0 || item.totalCost == 0" @click.stop="openNoFile(item,$event)">
                    <img src="../../../../../static/img/kaipiao(11).png" alt="">
                    <span>开票</span>
                  </div>
                  <div class="bill-bottom-btn" v-if="item.billStatus == 1 && item.invoiceStatus == 0 && item.totalCost !== 0 && item.totalCost !== 0" :id='item.billMonth' @click.stop="openFile(item,$event)">
                    <img src="../../../../../static/img/kaipiao(22).png" alt="">
                    <span>开票</span>
                  </div>
                  <div class="bill-bottom-btn" v-if="item.invoiceStatus == 1" @click.stop="goInvoiceDetail($event, item, '1')">
                    <img src="../../../../../static/img/fapiao(11).png" alt="">
                    <span>发票</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <van-dialog class="dialog" @click.native="takeDialog()" v-model="emailShow" :beforeClose="beforeClose" title="是否开票?" show-cancel-button>
          </van-dialog>

          <!-- </van-cell>
          </van-list> -->
        </div>
        <div v-else class="kr-nopay">
          <div class="kr-nopay-top">
            <span>尊敬的客户，您还没有账单。</span>
          </div>
          <div class="kr-nopay-bottom">
            <img src="../../../../../static/img/nopay.gif" alt="">
          </div>
        </div>
        <div class="kr-bill-fixed">
          <div class="kr-fixed-middle kr-fixed-btn" @click="goWaterInfo()">
            <span>水价</span>
            <span>信息</span>
          </div>
          <div class="kr-fixed-top kr-fixed-btn" @click="goWaterAnalyze()">
            <span>用水</span>
            <span>分析</span>
          </div>
          <div class="kr-fixed-bottom kr-fixed-btn" @click="goPay($event,status)">
            <span>预存</span>
            <span>水费</span>
          </div>
        </div>
      <!-- </van-pull-refresh> -->
    </page-content>
  </div>
</template>

<script>
import { Dialog, Toast, PullRefresh, List,Button  } from 'vant';
import headerTwo from '@/comments/headerTwo';
export default {
  components: {
    headerTwo
  },
  data() {
    return {
      title: '账单',
      groupArea: '',//地区名称
      isAIMeter: 0,//0 没有开通智能水表 1 开通了智能水表
      status:0,//0 未缴清 1 已缴清

      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,


      isShowPay: false,
      isShow: false,
      emailShow: false,
      email: '',
      url: '',

      showData: {
        isShowUL: true,
        isShowLink: true,//是否显示链接
        isShowBtn: true,//是否显示按钮
        isShowMoreUser: true,
        userName: "",//"张三"
        userNo: "",//"100011"
        userAddr: "",//"广东省深圳市罗湖区太宁路85号罗湖科技大厦408号"
        accountBalance: "",//预存金额 "101"
        totalArrearage: "",//欠费总额 "302"
        totalPay: "",//合计应缴  "201"
      },
      payed: require('../../../../../static/img/payed.png'),
      needData: [//链接所需的数据
      ],
      itemData: {},

      // 承载定时器
      setTime: '',
      invoiceData: {},
      // 发票中...按钮不可点击
      isChecking: false,
    }
  },
  created() {
    // if(localStorage.getItem('isMoreUser') == '1'){
    //   this.showData.isShowMoreUser = false;
    // }
    this.url = window.location.href.split('#')[0]
    // this.getNeedData();
    if (this.$route.query.accountNo !== undefined) {
      this.getUserNo(this.$route.query)
    } else {
      this.getUserNo(this.$store.state.billData[0])
    }

  },
  destroyed() {
    // sessionStorage.setItem('moreUser','')
    this.$store.state.moreUserShow = 2;
  },
  mounted() {

  },
  beforeDestroy() {
    clearInterval(this.setTime)
    this.setTime = null
  },
  methods: {
    //充值
    goPay(e,status) {
      // for (let i = 0; i < this.needData.length; i++) {
      //   if (this.needData[i].billStatus == 0) {
      //     localStorage.setItem('isHide', '0')
      //     this.$router.push({ path: "/pay" })
      //     // 有未缴清的 可以预存水费
      //   }
      // }
      // console.log(status,status !== 0);
      // if (status !== 0) {//已缴清不用跳往缴费页面
      //   return
      // }
      localStorage.setItem('isHide', '0')
      this.$router.push({ path: "/pay" })
    },
    //智能用水分析
    goWaterAnalyze() {
        let item = {}
        item.userNo = localStorage.getItem('userNo');
        item.groupCode = localStorage.getItem('groupCode')
        item.groupArea = this.groupArea;
        item.userAddress = this.showData.userAddr;
        item.userName = this.showData.userName;
        this.$router.push({ path: "/waterAnalyze", query: item })
    },
    scroll(e) {
      if ((parseInt(e.target.clientHeight) + Math.ceil(e.target.scrollTop)) === parseInt(e.target.scrollHeight)) {
        // console.log("到底")
      } else if (e.target.scrollTop == 0) {
        // console.log("到顶")
        e.stopPropagation()
      }
      this.$set(this, 'scrollTop', e.target.scrollTop)
    },
    touchmove(e) {
      if (this.scrollTop !== 0) {
        e.stopPropagation()//阻止冒泡
      }
    },
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.url = window.location.href;
        this.getNeedData();
      }, 500);
    },
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        console.log('1111');
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.needData.length) {
          this.finished = true;
        }

      }, 500);
    },

    emailTest() {
      let that = this;
      console.log(that.email);
      let message = '';
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (that.email == '' || that.email == null) {
        message = '邮箱编号不能为空。';
        Toast.fail(message);
        return
      } else if (!reg.test(that.email)) {
        message = '邮箱编号类型错误。';
        Toast.fail(message);
        return
      }
    },
    goWaterInfo() {
      this.$router.push({ path: "/waterPriceInfo" })
    },
    takeChange(item) {
      let query = {
        billMonth: "",
      };
      query.billMonth = item.billMonth;
      localStorage.setItem('bill', '0')
      this.$router.push({ path: "/billDetail", query, })
    },
    getNeedData() {
      let that = this;
      let userNo = '';
      let area = '';
      userNo = localStorage.getItem('userNo');
      area = localStorage.getItem('groupCode');
      let data = {
        billStatus: '1',
        area,
        userNo,
      }
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/bindUserBill',//接口地址
      }).then(res => {
        that.showData.userName = res.userName;
        that.showData.userNo = res.userNo;
        that.showData.groupCode = res.groupCode;
        that.showData.userAddr = res.userAddr;
        that.showData.accountBalance = res.accountBalance;
        that.showData.totalArrearage = res.totalArrearage;
        that.showData.totalPay = res.totalPay;
        that.groupArea = res.groupArea;
        that.isShowPay = parseFloat(res.totalArrearage) > parseFloat(res.accountBalance);//欠费>余额

        that.needData = res.billList;
        if (that.needData.length == 0) {
          that.isShow = true;
        } else {
          that.isShow = false;
        }
        for (let i = 0; i < that.needData.length; i++) {
          that.needData[i].billMonth = that.needData[i].billMonth.toString();
          that.needData[i].month = that.needData[i].billMonth.substring(4, 6);
          that.needData[i].year = that.needData[i].billMonth.substring(0, 4);
          that.needData[i].startDate = that.needData[i].dateRange.split('~')[0]
          that.needData[i].endDate = that.needData[i].dateRange.split('~')[1]
        }
      })

    },
    // 初始化
    init() {
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
        if (res.length == 1) {// 单户页面
          if (res[0].groupOpenId == '') {
            that.getGroupOpenId('#/bill');
            return
          }
          that.getUserNo(res[0]);
          localStorage.setItem('userNo', res[0].ctmNo);
          localStorage.setItem('groupOpenId', res[0].groupOpenId);
          localStorage.setItem('groupCode', res[0].groupCode);
        }
        that.getNeedData();
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
        console.log(res.list[0].userNo, res.list);
        that.isAIMeter = res.isAIMeter;
        localStorage.setItem('userNo', res.list[0].userNo);
        that.getNeedData();
      })
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
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
      }
      return (null);
    },
    goRecharge(item) {
      event.stopPropagation();
      let that = this;
      if (localStorage.getItem('groupOpenId') == '') {
        that.getGroupOpenId('#/recharge');
        return
      } else {
        that.$router.push({ path: "/recharge" })
      }
    },
    openFile(item, e) {
      if (this.isChecking) {
        Toast.fail('正在开票，请勿重复点击')
        return
      }
      let _this = this;
      _this.itemData = item;
      e.stopPropagation()
      if ($('#' + item.billMonth).text().indexOf('发票开具') > 0) {
        this.invoiceVer(item.fpcheckState, item.invoiceUrl)
      }
      _this.emailShow = true
      _this.billMonth = item.billMonth;
    },
    openNoFile(item, e) {//无开具发票
      if (item.billStatus == 0) {
        Toast.fail('请先缴费')
      } else if (item.totalCost == 0) {
        Toast.fail('无需开票')
      }
    },

    // 发票校验
    goInvoiceDetail(e, item, type) {
      if (e != 'event') {
        e.stopPropagation()
      }
      let _this = this;
      _this.itemData = item;
      if (item.fpcheckState == '1') {
        item.groupCode = localStorage.getItem('groupCode')
        item.userNo = localStorage.getItem('userNo')
        _this.$router.push({ path: '/invoicesDetail', query: item })
        return
      }
      let userNo = localStorage.getItem('userNo');
      let groupCode = localStorage.getItem('groupCode');
      if (type == '0') {
        var params = {//接口入参
          "data": {
            groupCode,
            billBatchNo: _this.invoiceData.billBatchNo,
            billCode: _this.invoiceData.billCode,
          },
        }
      } else if (type == '1') {
        var params = {//接口入参
          "data": {
            groupCode,
            billBatchNo: item.billBatchNo,
            billCode: item.billCode,
          },
        }
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/getInvoicePdf',//接口地址
      }).then(res => {
        if (res == '' || res == null) {
          if (type == '1') {
            Toast({
              message: '发票正在生成，请稍后再试',
              position: 'middle',
              duration: 2000
            })
          }
        } else {
          if (type == '0') {
            for (let i = 0; i < _this.needData.length; i++) {
              if (_this.itemData.billMonth == _this.needData[i].billMonth) {
                _this.$set(_this.needData[i], 'invoiceStatus', 1)
                _this.$set(_this.needData[i], 'invoiceUrl', res.url)
                _this.$set(_this.needData[i], 'fpcheckState', 1)
              }
            }
            $('#' + _this.itemData.billMonth).text('发票详情')
            Toast('开票成功');
            _this.isChecking = false
            clearInterval(_this.setTime)
            _this.setTime = null
          } else if (type == '1') {
            var item = {}
            // item.pdfUrlList = res.pdfImg
            item.invoiceUrl = res.invoiceUrl
            item.groupCode = localStorage.getItem('groupCode')
            item.userNo = localStorage.getItem('userNo')
            item.billMonth = _this.itemData.billMonth
            item.billBatchNo = _this.itemData.billBatchNo;
            item.billCode = _this.itemData.billCode;
            console.log(item);
            _this.$router.push({ path: '/invoicesDetail', query: item })
          }

        }
      })
    },

    // 发票校验
    invoiceVer(fpcheckState, invoiceUrl) {
      let _this = this;
      let userNo = localStorage.getItem('userNo');
      let groupCode = localStorage.getItem('groupCode');
      let params = {//接口入参
        "data": {
          invoiceUrl: invoiceUrl,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/getInvoiceImg',//接口地址
      }).then(res => {
        if (res == '' || res == null) {
          // Toast({
          //   message: '发票正在生成，请稍后再试',
          //   position: 'middle',
          //   duration: 2000
          // })
        } else {
          if (type == '0') {
            for (let i = 0; i < _this.needData.length; i++) {
              if (_this.itemData.billMonth == _this.needData[i].billMonth) {
                _this.$set(_this.needData[i], 'invoiceStatus', 1)
              }
            }
            $('#' + _this.itemData.billMonth).text('发票')
            clearInterval(_this.setTime)
            _this.setTime = null
          } else if (type == '1') {
            var item = {}
            item.pdfUrlList = res.pdfImg
            item.invoiceUrl = res.invoiceUrl
            item.groupCode = localStorage.getItem('groupCode')
            item.userNo = localStorage.getItem('userNo')
            item.billMonth = _this.itemData.billMonth
            _this.$router.push({ path: '/invoicesDetail', query: item })
          }

        }
      })
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
    // 开票弹出框关闭前钩子函数
    beforeClose(action, done) {
      event.stopPropagation();
      let _this = this;
      let userNo = localStorage.getItem('userNo');
      let groupCode = localStorage.getItem('groupCode');
      
      if (action == 'confirm') {
        this.isChecking = true
        let message = '';
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        let params = {//接口入参
          "data": {
            billMonth: _this.itemData.billMonth,
            groupCode,
            userNo,
            // email: _this.email,
          },
        }
        _this.$api.fetch({
          params,//参数
          apiUrl: '/myWater/invoiceOpening',//接口地址
        }).then(res => {
          _this.invoiceData = res
          // 列表数据
          // _this.getNeedData();
          _this.itemData.billBatchNo = res.billBatchNo
          _this.itemData.billCode = res.billCode
          _this.setTime = setInterval(() => {
            _this.goInvoiceDetail('event', _this.itemData, '0')
          }, 5000)
          Toast('开票申请已提交，最快五分钟完成开票，请稍后查看。');
          $('#' + _this.itemData.billMonth).text('开票中...')
          // _this.$router.push({ path: '/invoicesDetail' })

        }).catch(res => {
          this.isChecking = false
        })
        // 关闭弹框
        done()
      } else if (action == 'cancel') {
        _this.isChecking = false
        // 关闭弹框
        done()
      }
    },
    pay(e, billStatus){
      e.stopPropagation()
      // 如果账单已缴清，则不执行方法
      if (billStatus) {
        return
      }
      this.$refs.headerTwo.pay()
    },




    log(m) {
      console.log(m || 'log')
    },
  }
}
</script>

<style scoped lang="less">
.bill {
  height: 100%;
  .kr-bill-parent {
    height: 98%;
    .kr-bill {
      margin-top: 2%;
      margin-bottom: 2%;
      background: #fff;
      width: 100%;
      height: 30%;
      padding: 0 3%;
      display: flex;
      background: #efefef;
      .kr-bill-top {
        border-radius:2% 0 0 2%;
        width: 30%;
        padding: 5% 0;
        background: #ed702d;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .bill-title {
          text-align: center;
          font-size: 0.7rem;
          padding: 0% 0 1% 0;
        }
        .bill-slot {
          width: 20%;
          background: #fff;
          height: 1px;
        }
        .bill-time {
          font-size: 0.6rem;
        }
        .bill-time1 {
          padding: 1% 0 8% 0;
        }
        .bill-time2 {
          padding: 8% 0 1% 0;
        }
      }
      .kr-bill-top.active {
        background: #3193f6;
      }
      .kr-bill-bottom {
        border-radius:0 2% 2% 0;
        width: 70%;
        background: #fff;
        color: #000;
        padding: 1% 3% 3% 3%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .bill-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .bill-top-left {
            font-size: 1.2rem;
          }
          .bill-top-right {
            font-size: 0.8rem;
            color: #ed702d;
          }
          .bill-top-right.active {
            color: #3193f6;
          }
        }
        .bill-middle {
          span {
            font-size: 0.8rem;
            color: #7a7a7a;
          }
        }
        .bill-bottom {
          width: 100%;
          display: flex;
          justify-content: space-between;
          height: 25%;
          .bill-bottom-btn {
            height: 100%;
            line-height: 1;
            width:45%;
            padding: 0;
            text-align: center;
            border-radius: 5px;
            box-shadow: 1px 1px 5px 1px #efefef;
            color: #3193f6;
            // font-size: 0.8rem;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            img {
              width: 17%;
              height: 64%;
            }
            span {
              width:40%;
              padding: 0 0 0 2%;
            }
          }
          .kr-no-pay {
            // border: 1px solid #888;
            color: #888;
          }
        }
      }
    }
  }
  .kr-bill-fixed {
    position: fixed;
    width: 2.5rem;
    height: 8.5rem;
    bottom: 3%;
    left: 85%;
    right: 0;
    .kr-fixed-btn {
      font-size: 0.7rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #fff;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        display: inline-block;
      }
    }
    .kr-fixed-middle {
      background: #64aaf0;
    }
    .kr-fixed-bottom {
      margin-top: 0.5rem;
      background: #77e2b4;
    }
    .kr-fixed-top {
      margin-top: 0.5rem;
      background: #efcb62;
    }
  }

  // .van-pull-refresh {
  //   height: 100%;
  //   .van-pull-refresh__track{
  //     height: 100%;
  //   }
  // }
  .kr-btn {
    height: 6%;
    padding: 1% 2%;
    .kr-waterInfo {
      text-align: center;
      height: 100%;
      background: #64aaf0;
      color: #fff;
      border-radius: 10px;
      font-size: 1rem;
      line-height: 1.4rem;
    }
  }
  .page-content {
    // padding: 1% 2%;
    background: #efefef;
  }
  .kr-div_show {
    // margin-top: 2%;
    height: 70%;
    // background: #fff;
    overflow-y: auto;
    .item-inner {
      padding: 0%;
      width: 100%;
      .item-media {
        width: 25%;
      }
      .item-content {
        width: 75%;
        padding: 2%;
        border-bottom: 1px solid #efefef;
      }
    }
    .item-media {
      background: #3193f6;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #fff;
      border-bottom: 1px solid #efefef;
      // padding:2%;
      .kr-year {
        font-size: 16px;
      }
      .kr-month {
        font-size: 24px;
        font-weight: 500;
      }
      .last-item {
        background: #fff;
        // color:#ed702d;
        color: #3193f6;
        padding: 1% 2%;
        // font-size: 12px;
        width: 3rem;
        text-align: center;
        font-size: 0.6rem;
      }
      .active {
        color: #ed702d;
      }
    }
    .frist-media {
      background: #ed702d;
    }
  }
  .kr-nopay {
    padding: 10% 0;
    text-align: center;
    .kr-nopay-top {
      span {
        color: green;
        font-size: 1rem;
      }
    }
    .kr-nopay-bottom {
    }
  }
  .total_num {
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    font-size: 20px;
  }
  .list {
    margin: 0rem 0;
    li {
      border-bottom: 0;
    }
    .button {
      border-radius: 0.2rem;
    }
  }
  .item-inner {
    padding: 0 0 0 1% !important;
  }
  .item-icon {
    position: absolute;
    left: 56%;
    top: 5%;
  }
  .item-title {
    // font-family: PingFang_Regular;
    font-weight: 300;
    height: 1.3rem !important;
    line-height: 1.3rem !important;
    color: black;
  }
  .item-after {
    // font-family: PingFang_Bold;
    font-weight: 600;
  }
}
</style>