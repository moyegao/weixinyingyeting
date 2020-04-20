<template>
  <div class="ele-invoices">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>电子发票</header-title>
    </page-header> -->
    <page-content>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content-padded">
          <div class="row">
            <div class="col-100">
              <div class="user-card">
                <div class="card-header">
                  <img :src="header" alt="" width="35%" style="margin-left: 2%;" />
                  <!-- <router-link :to="{  path: 'fastpay' }"> -->
                  <!-- <b>无需绑定、快速缴费</b> -->
                  <!-- </router-link> -->
                </div>
                <div class="card-content">
                  <ul>
                    <li>
                      <span>{{tableData.userName}}（{{tableData.userNo}}）</span>
                    </li>
                    <li>
                      <span>{{tableData.userAddr}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isShowInvoices" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
            <van-cell v-for="(item,i) in tableData.billList" :key=" item.billMonth" :i='i'> -->
              <list v-for="(item,i) in tableData.billList" :key=" item.billMonth" :i='i'>
                <list-item>
                  <div class="item-icon">
                  </div>
                  <div class="item-media" v-if='i==0'>
                    <div class="kr-year">
                      <span>{{item.year}}</span>年
                    </div>
                    <div class="kr-month">
                      <span>{{item.month}}</span>月
                    </div>
                    <div class="last-item">
                      最近一期
                    </div>
                  </div>
                  <div class="item-media" v-if='i!==0'>
                    <div class="kr-year">
                      <span>{{item.year}}</span>年
                    </div>
                    <div class="kr-month">
                      <span>{{item.month}}</span>月
                    </div>
                  </div>

                  <div class="item-content">
                    <div class="item-title-row">
                      <div class="item-title">本期水量：{{item.curWaterNum}}吨</div>
                    </div>

                    <div class="item-title-row">
                      <div class="item-title">合计金额：<span class="total_num">{{item.totalCost}}</span>元</div>
                      <div class="item-after">
                        <!-- <van-button type="primary" size="mini">迷你按钮</van-button> -->
                        <m-button size="small" style="background-color: #2CCA78;" :round="true" @click.native="invoice(item)" v-if="item.invoiceStatus == 0">
                          开票
                        </m-button>
                        <m-button size="small" :round="true" @click.native="invoiceEnd(item)" v-if="item.invoiceStatus == 1">
                          发票
                        </m-button>
                      </div>
                    </div>
                    <div class="item-title-row">
                      <div class="item-title">用水区间：{{item.dateRange}}</div>
                    </div>
                  </div>
                </list-item>
              </list>
            <!-- </van-cell>
          </van-list> -->
        </div>

        <div v-if="isShowInvoices" class="kr-nopay">
          <div class="kr-nopay-top">
            <span>尊敬的客户，您暂无电子发票。</span>
          </div>
          <div class="kr-nopay-bottom">
            <img src="../../../../static/img/nopay.gif" alt="">
          </div>
        </div>
      </van-pull-refresh>
    </page-content>
    <van-dialog class="dialog" v-model="emailShow" :beforeClose="beforeClose" title="是否确认开票？" show-cancel-button>
      <!-- <van-field v-model="email" placeholder="请输入邮箱地址" /> -->
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Toast, PullRefresh } from 'vant';
export default {
  data() {
    return {
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      isShowInvoices: false,//账单是否为空
      email: '',
      emailShow: false,
      user: "小胖子",
      header: require('../../../../static/img/header1.png'),
      rabbit: require('../../../../static/img/rabbit.jpg'),
      payed: require('../../../../static/img/payed.png'),
      list: [
        {
          title: '用户编号',
          content: '张三（1001111）'
        },
        {
          title: '用户地址',
          content: '步埠路39号'
        },
        {
          title: '预存余额',
          content: '预存金额：0元  欠费：116.7元'
        },
        {
          title: '合计应缴',
          content: '合计应缴：116.70元'
        }
      ],
      buttons: [
        {
          name: '切换用户',
          linkUrl: ''
        },
        {
          name: '充值',
          linkUrl: 'pay'
        },
        {
          name: '缴费',
          linkUrl: 'recharge'
        }
      ],
      tableData: [],
      isSingle: true,
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 5)
        return value.slice(0, 5) + '...'
      else
        return value
    }
  },
  mounted() {
    if (window.location.href.indexOf('userNo') > -1) {
      this.initMany()
    } else {
      this.init()
    }

  },
  methods: {
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.tableData.billList.length) {
          this.finished = true;
        }

      }, 500);
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
        if (window.location.href.indexOf('userNo') > -1) {
          this.initMany()
        } else {
          this.init()
        }
      }, 500);
    },

    // 获取列表数据(单户)
    init() {
      var _this = this;
      this.isSingle = true
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId')
        },
        // "data": 'ok6sbwaaL5BexHwyWbdCu4I9ddOE',
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/invoiceInitList',//接口地址
      }).then(res => {
        // _this.moduleAccess(res.groupCode, '1')
        _this.tableData = res;
        if (_this.tableData.billList.length == 0) {
          _this.isShowInvoices = true;
        }
        setTimeout(() => {
          for (let i = 0; i < _this.tableData.billList.length; i++) {
            _this.tableData.billList[i].billMonth = _this.tableData.billList[i].billMonth.toString();
            _this.tableData.billList[i].month = _this.tableData.billList[i].billMonth.substring(4, 6);
            _this.tableData.billList[i].year = _this.tableData.billList[i].billMonth.substring(0, 4);
          }
        }, 500);
      })
    },
    // 获取列表数据(多户点击进入)
    initMany() {
      var _this = this;
      this.isSingle = false
      let params = {//接口入参
        "data": {
          "groupCode": this.$route.query.groupCode,
          "userNo": this.$route.query.userNo
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/invBillList',//接口地址
      }).then(res => {
        // _this.moduleAccess(this.$route.query.groupCode, '1')
        _this.tableData = res;
        if (_this.tableData.billList.length == 0) {
          _this.isShowInvoices = true;
        }
        setTimeout(() => {
          for (let i = 0; i < _this.tableData.billList.length; i++) {
            _this.tableData.billList[i].billMonth = _this.tableData.billList[i].billMonth.toString();
            _this.tableData.billList[i].month = _this.tableData.billList[i].billMonth.substring(4, 6);
            _this.tableData.billList[i].year = _this.tableData.billList[i].billMonth.substring(0, 4);
          }
        }, 500);
      })
    },
    // 模块访问
    moduleAccess(groupCode, moduleId) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': moduleId,
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
    },
    // 开票按钮
    invoice(item) {
      var _this = this;
      _this.emailShow = true
      _this.billMonth = item.billMonth
      // let params = {//接口入参
      //   "data": {
      //     "groupCode": _this.tableData.groupCode,
      //     "userNo": _this.tableData.userNo
      //   },
      // }

      // this.$api.fetch({
      //   params: params,//参数
      //   apiUrl: '/myWater/emailQuery',//接口地址
      // }).then(res => {

      //   _this.emailShow = true
      //   _this.email = res
      //   _this.billMonth = item.billMonth
      // })
    },
    // 开票弹出框关闭前钩子函数
    beforeClose(action, done) {
      var _this = this;
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (action == 'confirm') {
        // if (!_this.email) {
        //   Toast.fail('邮箱地址不能为空！');
        //   done()
        //   return
        // } else if (!reg.test(_this.email)) {
        //   Toast.fail('邮箱地址格式不正确！');
        //   done()
        //   return
        // }
        let params = {//接口入参
          "data": {
            "billMonth": _this.billMonth,
            "groupCode": _this.tableData.groupCode,
            "userNo": _this.tableData.userNo,
            // "email": _this.email,
          },
        }
        this.$api.fetch({
          params: params,//参数
          apiUrl: '/myWater/invoiceOpening',//接口地址
        }).then(res => {
          Toast.success('发票已申请成功，我们将在最快5分钟内完成开票，请稍后查询')
          setTimeout(() => {
            if (_this.isSingle) {
              // _this.moduleAccess(_this.tableData.groupCode, '2')
              _this.init()
            } else {
              // _this.moduleAccess(_this.$route.query.groupCode, '2')
              _this.initMany()
            }
          }, 2000);
        })
        // 关闭弹框
        done()
      } else if (action == 'cancel') {
        // console.log('直接关闭弹框');
        // 关闭弹框
        done()
      }
    },
    // 发票按钮
    invoiceEnd(item) {
      console.log(item);
      // return
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": _this.tableData.groupCode,
          "userNo": _this.tableData.userNo,
          "billMonth": item.billMonth,
          "type": 0,
          // "groupCode": _this.tableData.groupCode,
          // "userNo": _this.tableData.userNo,
          // 'billMonth': item.billMonth
        },
      }
      // return
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/getInvoicePdf',//接口地址
      }).then(res => {
        if (res == '' || res == null) {
          Toast({
            message: '发票正在生成，请稍后再试',
            position: 'middle',
            duration: 2000
          })
        } else {
          // window.open(res)
          var content = {}
          // content.pdfUrlList = res.pdfImg
          // content.invoiceUrl = res.invoiceUrl
          content.groupCode = _this.tableData.groupCode
          content.userNo = _this.tableData.userNo
          content.billMonth = item.billMonth
          content.totalCost = item.totalCost
          _this.$router.push({ path: '/invoicesDetail', query: content })
        }
      })
    },
    log(m) {
      console.log(m || 'log')
    }
  }
}
</script>

<style scoped lang="less">
.ele-invoices {
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
  .list .item-inner {
    padding: 0 0 0 0.5rem;
  }
  .yue_box {
    width: 65px;
    height: 65px;
    line-height: 65px;
    text-align: center;
  }
  .content-padded {
    // height: 9rem;
    height: 30%;
    margin: 0;
    background: url("../../../../static/img/shuidi.png") no-repeat 0px 0px;
    background-size: 100% 100%;
  }
  .first_li {
    // .button {
    //   background: none;
    //   color: #fff !important;
    //   font-family: PingFang_Bold;
    //   // text-align: right;
    // }
    a {
      background: none;
      color: #fff !important;
      // font-family: PingFang_Light;
      font-weight: 100;
      line-height: 20px;
    }
    img {
      width: 20px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .total_num {
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    font-size: 20px;
  }
  .list {
    // height: 70%;
    height: 100%;
    overflow-y: auto;
    margin: 0rem 0;
    width: 100%;
    .button {
      border-radius: 0.2rem;
    }
    .item-content {
      width: 75%;
    }
    .item-media {
      width: 25%;
    }
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
  }
  .item-after {
    // font-family: PingFang_Bold;
    font-weight: 600;
  }
  .col-100 {
    /*font-size: 14px;*/
    /*		color: red;*/
    .user-card {
      // font-family: PingFang_Light;
      font-weight: 100;
      border-radius: 10px;
      padding: 15px 15px 0px 15px;
      // background: url('../../../../project/assets/img/sfcj-bg.png') no-repeat;
      background-size: 100%;
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
          color: #e0e0e0;
          float: right;
          // font-family: PingFang_Light;
          font-weight: 100;
          font-size: 14px;
          line-height: 30px;
          padding-right: 15px;
          background: url("../../../../static/img/kuaisu.png") no-repeat;
          background-position: right;
          background-size: 13px;
          // text-decoration: underline;
          border-bottom: 1px solid white;
          // b {
          //   text-decoration: underline;
          // }
        }
        // a {
        //   float: right;
        //   color: #fff;

        //   b {
        //     font-size: 16px;
        //     font-weight: normal;
        //     text-decoration: underline;
        //   }
        // }
      }
      .card-content {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        // padding-top: 10px;
        ul {
          width: 60%;

          li {
            color: #fff;
            padding: 7px;
            font-weight: 300;
            width: 100%;
            b {
              width: 40%;
              font-weight: 300;
            }
            span {
              width: 60%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            // font-size: 15px;
          }
        }
        ol {
          width: 40%;
          li {
            padding: 6px;
            text-align: right;
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
        }
      }
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
      font-size: 0.6rem;
      width: 3rem;
      text-align: center;
    }
    .active {
      color: #ed702d;
    }
  }
}
</style>