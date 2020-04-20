<template>
  <div class="invoices-detail">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>发票详情</header-title>
    </page-header> -->
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <div class="header-pic">
          <!-- <img :src="invoice" alt="" width="100%" /> -->
          <div class="pdf">
            <img :src="'data:image/png;base64,'+item" v-for="item in tableData.pdfImg" :key="item" width="100%" />
          </div>
        </div>
        <p class="form-button">
          <!-- <m-button size="large" :round="true">发送邮件</m-button> -->
          <van-button type="info" @click="downLoad">发票下载</van-button>
          <van-button type="info" @click="getEmail">发送邮件</van-button>
          <van-button type="info" @click="cardBagAdd2">添加至卡包</van-button>
        </p>
      <!-- </van-pull-refresh> -->
    </page-content>
    <van-dialog class="dialog" v-model="emailShow" :beforeClose="beforeClose" title="邮箱地址" show-cancel-button>
      <van-field v-model="email" placeholder="请输入邮箱地址" />
    </van-dialog>
  </div>
</template>

<script>
// import pdf from 'vue-pdf'
import { Dialog, Toast,PullRefresh } from 'vant';
export default {
  // components: {
  //   pdf
  // },
  data() {
    return {
      invoice: require('../../../../../static/img/fapiao.png'),
      email: '',
      emailShow: false,
      tableData: {},
      money:0,
    }
  },
  mounted() {
    $('#myTitle').html('发票详情')
    this.init()
  },
  methods: {
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
        this.init()
      }, 500);
    },
    // 初始化
    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          invoiceUrl: this.$route.query.invoiceUrl
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/getInvoiceImg',//接口地址
      }).then(res => {
        _this.tableData = res
      })
    },
    // 发票下载
    downLoad(){
      // window.open(this.tableData.invoiceUrl)
      var item = {}
      item.downloadURL = this.tableData.invoiceUrl
      // this.$router.push({ path: '/download', query: item })
      window.location.href = window.location.protocol + "//" + window.location.host + '/wxcss2/#/download?url=' + this.tableData.invoiceUrl
      
    },
    // 获取邮箱地址
    getEmail() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": _this.$route.query.groupCode,
          "userNo": _this.$route.query.userNo
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/emailQuery',//接口地址
      }).then(res => {
        _this.emailShow = true
        _this.email = res
      })
    },
    //获取卡包money字段
    cardBagAdd2(){
      var _this = this;
      let params = {//接口入参
        "data": {
          groupCode: _this.$route.query.groupCode,
          billBatchNo: _this.$route.query.billBatchNo,
          billCode: _this.$route.query.billCode,

          // 公共调接口需要参数，显示加载中...非接口入参
          type: 'kabao'
        }
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/getInvoicePdf',//接口地址
      }).then(res => {
        _this.money = res.money;
        _this.cardBagAdd()
      })
    },
    // 添加至卡包
    cardBagAdd() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "openId": localStorage.getItem('openId'),
          "groupCode": _this.$route.query.groupCode,
          "userNo": _this.$route.query.userNo,
          "billMonth": _this.$route.query.billMonth,
          // "money": Number(_this.$route.query.totalCost * 100),
          "money": Number(_this.money * 100),
          "frontEndurl": window.location.href
        }
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/getInvoiceAuth',//接口地址
      }).then(res => {
        window.location.href = res
      })
    },
    // 发送邮件
    sendEmail() {
      var _this = this;
      let params = {// 接口入参
        "data": {
          "groupCode": _this.$route.query.groupCode,
          "userNo": _this.$route.query.userNo,
          "email": _this.email,
          "content": _this.tableData.invoiceUrl,
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/invoiceSend',//接口地址
      }).then(res => {
        Toast.success('电子发票已成功发送至您邮箱，请稍后查看')
      })
    },
    // 开票弹出框关闭前钩子函数
    beforeClose(action, done) {
      var _this = this;
      if (action == 'confirm') {
        _this.sendEmail()
        // 关闭弹框
        done()
      } else if (action == 'cancel') {
        // 关闭弹框
        done()
      }
    },

  }
}
</script>

<style scoped lang="less">
.invoices-detail {
  p {
    width: 100%;
    margin: auto;
    margin-top: 1rem;
    text-align: center;
  }
}
</style>