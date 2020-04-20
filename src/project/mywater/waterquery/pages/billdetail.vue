<template>
  <div class="billdetail">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>用户详情</header-title>
    </!-->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title='title'></myHeader> -->
        <!-- <headerTwo :showData="showData" :title="title"></headerTwo> -->
        <headerThree :message='message'></headerThree>
        <div class="row info_content" v-if="!isShow" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <div class="col-100">
            <div class="user-card-bg">

              <div class="kr-span">
                <span class="kr-span-left">
                  基本信息
                </span>
              </div>
              <van-field class="yh-my-blue" v-model="listData.billMonth" label="所属年月" left-icon="clock-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="listData.readCycle" label="抄表周期" left-icon="points" size="large" disabled />
              <van-field class="yh-my-blue" v-model="listData.userAddress" label="客户地址" left-icon="location-o" size="large" rows="1" autosize type="textarea" disabled placeholder="" />
              <van-field class="yh-my-red" v-model="listData.waterType" label="用水类型" left-icon="apps-o" size="large" disabled />
              <van-field class="yh-my-blue" v-model="listData.payTime" left-icon="tosend" label="缴费时间" disabled placeholder="" size="large" />
              <van-field class="yh-my-red" v-model="listData.lastReadDate" label="上次抄表日期" left-icon="underway-o" size="large" disabled />
              <van-field class="yh-my-blue" v-model="listData.thisReadDate" label="本次抄表日期" left-icon="underway-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="listData.lastReadData+'m³'" label="上期抄码" left-icon="edit" size="large" disabled />
              <van-field class="yh-my-blue" v-model="listData.thisReadData+'m³'" label="本期抄码" left-icon="edit" size="large" disabled />
              <div class="yh_kongbai"></div>
            </div>
            <div class="yh-kongge"></div>
            <div class="user-card-bg">
              <div class="kr-span">
                <span class="kr-span-left">
                  合计金额
                </span>
                <span class="kr-span-right">
                  {{listData.totalAmount}}元
                </span>
              </div>
              <div class="message_content">
                <div id='billDetail-echarts'></div>
              </div>
              <div class="message_title" v-for="(item,i) in tableData" :key="i">
                <van-field v-model="item.billMoney+'元'" :label="item.costType" size="large" disabled />
                <div class="yh_kongbai"></div>
              </div>
            </div>
            <div class="yh-kongge"></div>
            <div v-for="(item, i) in tableData" :key="i" v-if="i!==tableData.length-1">
              <div class="user-card-bg list_two">
                <van-field class="yh-yingshou" v-model="item.billMoney+'元'" :label="'应收'+item.costType" size="large" disabled />

                <span v-for="(stepBillItem, index) in item.stepBill" :key="index">
                  <div class="grade_title">
                    <span class="content_left" v-if="index == 0">
                      <div class="point"></div>第一档
                    </span>
                    <span class="content_left" v-if="index == 1">
                      <div class="point"></div>第二档
                    </span>
                    <span class="content_left" v-if="index == 2">
                      <div class="point"></div>第三档
                    </span>
                    <span class="content_left" v-if="index == 3">
                      <div class="point"></div>第四档
                    </span>
                    <span class="content_left" v-if="index == 4">
                      <div class="point"></div>第五档
                    </span>
                    <span class="content_left" v-if="index == 5">
                      <div class="point"></div>第六档
                    </span>
                    <span class="content_right">{{stepBillItem.total}}元</span>
                    <!-- <div class="underline"></div> -->
                  </div>
                  <!-- <van-field class="yh-frist" v-model="stepBillItem.total+'元'" label="第一档" size="large" disabled/> -->
                  <!-- <div class="message_content">
                    <div class="content_box">
                      <span class="content_left little_title">水量(立方米)</span>
                      <span class="content_right little_title">{{stepBillItem.waterNum}}m³</span>
                    </div>
                  </div> -->
                  <van-field v-model="stepBillItem.waterNum+'m³'" label="水量(立方米)" size="large" disabled />
                  <!-- <div class="message_content">
                    <div class="content_box">
                      <span class="content_left little_title">单价(元/m³)</span>
                      <span class="content_right little_title">{{stepBillItem.price}}元</span>
                    </div>
                  </div> -->
                  <van-field v-model="stepBillItem.price+'元'" label="单价(元/m³)" size="large" disabled />
                  <!-- <div class="yh-kongge" v-if="index == (item.stepBill.length -1)"></div> -->
                </span>
                <div class="yh_kongbai"></div>
              </div>

              <div class="yh-kongge" v-if='i!==tableData.length-2'></div>
            </div>

            <div class="btn-upload">
              <m-button size="large" icon="back" @click.native="billRead()">
                账单预览
              </m-button>
            </div>
            <van-dialog class="dialog" id="kr-dialog" v-model="emailShow" :beforeClose="beforeClose" title="发送邮件" show-cancel-button>
              <van-field v-model="email" placeholder="请输入邮箱名" oninput="this.value=this.value.replace(/[^0-9.@a-zA-Z]+/,'');" @blur="emailTest()" />
            </van-dialog>
          </div>
        </div>
        <div v-else>
          <img :src="imgData" alt="">
          <!-- <billRead></billRead> -->
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>

<script>
import { Dialog, Field, Toast, PullRefresh, List } from 'vant';
import headerTwo from '@/comments/headerTwo';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import billRead from './billRead.vue'
export default {
  components: {
    myHeader, billRead, headerTwo, headerThree
  },
  data() {
    return {
      showData: {
        isShowUL: true,
        isShowLink: false,//是否显示链接
        isShowBtn: false,//是否显示按钮
        isShowArea: true,
        userName: "",//"张三"
        userNo: "",//"100011"
        userAddr: "",//"广东省深圳市罗湖区太宁路85号罗湖科技大厦408号"
        accountBalance: "",//预存金额 "101"
        totalArrearage: "",//欠费总额 "302"
        totalPay: "",//合计应缴  "201"
      },
      message: {
        title: "",
        span1: "",
        span2: "",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: "账单详情",
      emailShow: false,
      isShow: false,
      imgData: '',
      email: '',
      listData: {},
      tableData: [],
      erchartData: [],
      erchartTitle: [],
    }
  },
  mounted() {
    // localStorage.setItem('bill','1')
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

    log(m) {
      console.log(m || 'log')
    },
    init() {
      // sessionStorage.setItem('moreUser','1')
      let groupCode = localStorage.getItem('groupCode');
      let userNo = localStorage.getItem('userNo');
      let billMonth = this.$route.query.billMonth;
      let data = {
        groupCode,
        userNo,
        billMonth,
      }
      let that = this;
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/userBillQuery',//接口地址
      }).then(res => {
        that.listData = res;
        that.tableData = res.list;
        that.erchartData = that.tableData;
        // that.showData.userNo = res.userNo;
        // that.showData.userAddress = res.userAddress;
        // that.showData.userName = res.userName;
        // that.showData.groupArea = res.groupArea;
        this.message = {
          title: "账单详情",
          span1: res.groupArea,
          span2: res.userName + ' (' + res.userNo + ')',
          span3: res.userAddress,
          status: 0,
          warning1: '疑似漏水！',
        };
        for (let i = 0; i < that.tableData.length; i++) {
          that.erchartData[i].value = that.tableData[i].billMoney;
          that.erchartData[i].name = that.tableData[i].costType;
          // that.erchartTitle[i] = that.tableData[i].costType;
          that.erchartTitle.push(that.tableData[i].costType)
        }
        that.erchart()
      })
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
    erchart() {
      let pie = this.$echarts.init(
        document.getElementById("billDetail-echarts")
      );
      this.drawPie(pie);
    },
    drawPie(name) {
      let that = this;
      name.setOption({
        title: {
          text: '',//某站点用户访问来源
          subtext: '',//纯属虚构
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: that.erchartTitle,
        },
        series: [
          {
            name: '',//访问来源
            type: 'pie',
            radius: '55%',
            // center: ['50%', '60%'],
            center: ['65%', '60%'],
            data: that.erchartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.addEventListener('resize', function () {
        name.resize();
      })
      setTimeout(() => {
        name.resize();
      }, 10);
    },

    dataURLtoBlob(dataurl) {
      // var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      let bstr = atob(dataurl);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // , { type: mime }
      return new Blob([u8arr]);
    },

    downloadFile(url, name = 'flie') {
      let a = document.createElement("a")
      a.setAttribute("href", url)
      a.setAttribute("download", name)
      a.setAttribute("target", "_blank")
      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      a.dispatchEvent(clickEvent);
    },

    downloadFileByBase64(base64, name) {
      let myBlob = this.dataURLtoBlob(base64)
      let myUrl = URL.createObjectURL(myBlob)
      this.downloadFile(myUrl, name)
    },

    dataURLtoFile(dataurl, filename = 'file') {//base64 转文件
      // let arr = dataurl.split(',')
      // let mime = arr[0].match(/:(.*?);/)[1]
      // let suffix = mime.split('/')[1]
      let bstr = atob(dataurl)
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}`)
      // , {type: mime}
    },
    // var base64Img = 'data:image/bmp;base64,LASDJFLKAJDFLKASDJFL...' // base64编码的图片
    // var imgFile = dataURLtoFile(base64Img); // 这样就会转成一个 图片文件了。
    upLoad() {//账单下载
      let _this = this;
      let groupCode = localStorage.getItem('groupCode');
      let userNo = localStorage.getItem('userNo');
      let params = {//接口入参
        "data": {
          groupCode,
          userNo,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/emailQuery',//接口地址
      }).then(res => {
        _this.emailShow = true
        _this.email = res
      })

      // let that = this;
      // let groupCode = localStorage.getItem('groupCode');
      // let userNo = localStorage.getItem('userNo');
      // let billMonth = that.$route.query.billMonth;
      // let params = {//接口入参
      //   data: {
      //     groupCode,
      //     userNo,
      //     billMonth,
      //   }
      // }
      // this.$api.fetch({
      //   params,//参数
      //   apiUrl: '/myWater/billDownload',//接口地址
      // }).then(res => {
      //   // window.open(res);
      //   // let imgFile = that.dataURLtoFile(res);
      //   that.downloadFileByBase64(res,'file')
      //   that.imgData = 'data:image/pdf;base64,'+res;
      //   that.isShow = true;
      //   // console.log(imgFile);
      //   // window.open(imgFile);
      // })

    },
    billRead() {//跳转到账单预览页面
      // this.isShow = true;
      // _this.$router.push({ path: '/invoicesDetail', query: item })
      let item = {};
      item.billMonth = this.$route.query.billMonth;
      this.$router.push({ path: '/billRead', query: item })
    },
    beforeClose(action, done) {
      event.stopPropagation();
      let _this = this;
      if (action == 'confirm') {
        // _this.emailTest();
        let message = '';
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (_this.email == '' || _this.email == null) {
          message = '邮箱编号不能为空。';
          Toast.fail(message);
          // 关闭弹框
          done()
          // _this.appendChild()
        } else if (!reg.test(_this.email)) {
          message = '邮箱编号格式不正确。';
          Toast.fail(message);
          // 关闭弹框
          done()
          // _this.appendChild()
        } else {
          let groupCode = localStorage.getItem('groupCode');
          let userNo = localStorage.getItem('userNo');
          let billMonth = _this.$route.query.billMonth;
          let params = {//接口入参
            data: {
              groupCode,
              userNo,
              billMonth,
              email: _this.email,
            }
          }
          console.log(params);
          _this.$api.fetch({
            params,//参数
            apiUrl: '/myWater/billDownload',//接口地址
          }).then(res => {
            Toast.success('账单已成功发送至您邮箱，请稍后查看')
          })
          // 关闭弹框
          done()
        }
      } else if (action == 'cancel') {
        // 关闭弹框
        done()
      }
    },
    appendChild() {//追加子元素
      console.log('111');
      // van-loading van-loading--circular van-button__loading
      $('#kr-dialog .van-dialog__confirm .van-button__loading').css({ display: 'none', border: '1px solid #000', });
      console.log('222');
      let str = $("<span class='van-button__text'>确认</span>")
      console.log('333');
      $('#kr-dialog .van-dialog__confirm').append(str);
      console.log('4444');
    },
  }
}
</script>

<style scoped lang="less">
.billdetail {
  .yh_kongbai {
    width: 100%;
    height: 10px;
    background: #fff;
  }
  .header-two {
    height: 30%;
  }
  height: 100%;
  #billDetail-echarts {
    width: 100%;
    height: 10rem;
    border-bottom: 1px solid #eee;
  }
  .table_content {
    width: 100%;
    border: 1px solid #e4e4e4;
    border-left: none;
    border-right: none;
    border-bottom: none;
    th {
      text-align: center;
      font-size: 14px;
      font-weight: 600;
    }
    td {
      text-align: center;
      width: 50px;
      font-size: 14px;
      font-weight: 600;
    }
    tr {
      height: 35px;
    }
  }

  .user_msg {
  }
  .info_content {
    // height: 70%;
    // overflow: auto;
    padding-bottom: 10px;
  }
  .btn-upload {
    // margin-top: 2%;
    // margin-bottom: 2%;
    // text-align: center;
    padding: 0 35%;
    background: #fff;
    .button {
      width: 100%;
      // padding: 5% 0;
      .kr-img {
        width: 25%;
      }
    }
  }
  .content-padded {
    margin: 0;
    height: 100%;
  }
  .row {
    margin-left: 0%;
  }

  .col-100 {
    // padding: 0 .5rem;
    background: #eee;
    width: 100%;
    margin-left: 0%;
    .grids-small {
      .grid {
        border: none;
        .grid-icon {
          border: 1px solid red;
        }
      }
    }
    .midle-bar {
      padding: 0 10px 0 15px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      b {
        font-size: 20px;
        line-height: 40px;
      }
    }
    .yh-kongge {
      height: 0.5rem;
      background: #eee;
    }
    .user-card-bg {
      border-radius: 5px;
      background: #fff;
      background-size: 102%;
      padding: 0 2%;
      // box-shadow: 1px 1px 5px 1px #888888;
      .kr-span {
        padding: 12px 16px;
        width: 100%;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        span {
          display: inline-block;
          font-size: 13px;
        }
        .kr-span-right {
          float: right;
          color: #ed702d;
          font-size: 0.9rem;
          // border-bottom: 1px solid #ed702d;
          a {
            color: #ed702d;
          }
        }
        .kr-span-left {
          font-size: 0.9rem;
          // float: left;
          display: flex;
          align-items: center;
          // color: #489eff;
          color: #000;
        }
      }
      .message_title {
        color: #000;
        // padding: 10px 10px 11px 10px;
        .underline {
          width: 100%;
          height: 1px;
          background-color: #eee;
          margin: 0 auto;
          margin-top: 10px;
        }
        // border-bottom: 1px solid #eee;
        .content_left {
          font-size: 18px;
          .point {
            display: inline-block;
            height: 10px;
            width: 10px;
            background-color: black;
            border-radius: 5px;
            margin-right: 10px;
          }
        }
        .content_right {
          font-size: 18px;
          float: right;
        }
      }
      .message_content {
        .content_box {
          // padding: 5px 10px 5px 10px;
          padding: 2px 10px 2px 10px;
          .content_right {
            float: right;
            // color: #787878;
            color: #999;
          }
        }
      }
      .grade_title {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        .underline {
          // width: 100%;
          // height: 1px;
          // background-color: #eee;
          margin: 0 auto;
          margin-top: 10px;
        }
        // border-bottom: 1px solid #eee;
        .content_left {
          color: #323232;
          .point {
            display: inline-block;
            height: 10px;
            width: 10px;
            background-color: #323232;
            border-radius: 5px;
            margin-right: 10px;
          }
        }
        .content_right {
          float: right;
          color: #787878;
        }
      }
      .list {
        margin: 0;
        padding-bottom: 0.5rem;
        border-top: 0;
        li {
          border-bottom: 0;
          .link-arrow {
            display: none !important;
          }
        }
        li:first-child {
          border-top: 0;
        }
        .item-inner {
          padding: 0 0.25rem;
        }
        .item-content {
          padding: 0.4rem 0.25rem 0rem 0rem;
          .item-title-row {
            div {
              display: inline-block;
              border-bottom: #eee solid 1px;
              padding-left: 0.25rem;
              span {
                font-size: 13px;
                color: #989898;
                // font-family: PingFang_Bold;
                font-weight: 600;
              }
              input {
                width: 95%;
                font-size: 15px;
                border: none;
                // font-family: PingFang_Bold;
                font-weight: 600;
              }
            }
            .first_content {
              width: 45%;
            }
            .second_content {
              width: 100%;
            }
            .Third_content1 {
              width: 26%;
            }
            .Third_content2 {
              width: 36%;
            }
            .Third_content3 {
              width: 36%;
            }
            .kr-span {
              width: 100%;
              // padding: 0.4rem 0.75rem 0.2rem 0.25rem;
              border-bottom: 0;
              span {
                display: inline-block;
                font-size: 13px;
                // font-family: PingFang_Bold;
                font-weight: 600;
              }
              .kr-span-right {
                float: right;
                color: #ee7534;
                // border-bottom: 1px solid #ee7534;
                a {
                  color: #ee7534;
                }
              }
              .kr-span-left {
                float: left;
                color: #479eff;
              }
            }
          }
        }
      }
    }
    .list_two {
      .item-content {
        padding: 0.4rem 0.25rem 0.8rem 0rem !important;
      }
      .list {
        padding: 0;
      }
    }
  }
}
</style>