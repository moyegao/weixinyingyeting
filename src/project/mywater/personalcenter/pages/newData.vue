<template>
  <div class="new-data">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>智慧用水</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <div class="row">
          <div class="col-100">
            <div class="user-card">
              <div class="card-header">
                <img :src="header" alt="" width="35%" />
              </div>
              <div class="card-content">
                <ul>
                  <li>
                    <span>{{formData.groupArea}}</span>
                  </li>
                  <li>
                    <span>{{formData.userName}}&nbsp;&nbsp;({{formData.userNo}})</span>
                  </li>
                  <li>
                    <span>{{formData.userAddress}}</span>
                  </li>
                </ul>

                <ol v-if="status == 1">
                  <li class="kr-img">
                    <img src="../../../../../static/img/jingbao.png" alt="">
                  </li>
                  <li>
                    <p style="text-align: center;">疑似漏水!</p>
                    <p style="text-align: center;">{{result}}</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div> -->
        <headerThree :message='message'></headerThree>
      </div>
      <div class="row kr-row">
        <div class="kr-top">
          <div id="calendar" :class="{'change':isChange}">
            <!-- 年份 月份 -->
            <div class="year-month">
              <div class="year-month_left">
                <!-- <ul>
                  <li>周{{weekdays[newWeek]}}</li>
                  <li>{{currentYear}}年</li>
                </ul> -->
                <span class="top-tite">智慧用水(单位:吨)</span>
                <span class="top-time">{{currentYear}}年</span>
                <span class="top-time1">{{currentMonth}}月</span>
                <span class="kr-span kr-span3">
                  <van-icon name="arrow-up" @click="takeChage(0)" />
                  <van-icon name="arrow-down" @click="takeChage(1)" />
                </span>
              </div>
              <!-- <div class="year-month_right"><x-icon @click="addSchedule" type="ios-plus-empty" size="30" class="i-plus-empty"></x-icon></div> -->
            </div>
            <!-- 星期 -->
            <ul class="weekdays">
              <li v-for="(vo,index) in weekdays" v-text="vo" :key="index"></li>
            </ul>
            <!-- 日期 -->
            <ul class="days" :class="{'fadeOut':fadeOut,'fadeIn':fadeIn,'fadeOutR':fadeOutR,'fadeInR':fadeInR}" @touchstart="allTouchStart" @touchend="allTouchEnd" @touchstart.stop="touchStart" @touchend.stop="touchEnd">
              <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
              <li v-for="(dayobject,index) in days" :class="{'weekend':(index%7 === 0)||((index+1)%7 === 0)}" :key="index">
                <!--本月-->
                <!--如果不是本月 改变类名加灰色-->
                <div v-if="dayobject.day.getMonth()+1 !== currentMonth" @click="otherMonth(dayobject.day.getDate())" class="other-month">
                  {{ dayobject.day.getDate() }}</div>
                <!--如果是本月 还需要判断是不是这一天-->
                <div v-else class="everyDay">
                  <!--今天 同年同月同日-->
                  <!-- <div
                    @click="getDayMessage(currentYear,currentMonth,dayobject.day.getDate())"
                    v-if="dayobject.day.getFullYear() === new Date().getFullYear() && dayobject.day.getMonth() === new Date().getMonth() && dayobject.day.getDate() === new Date().getDate()"
                    class="active"
                  >{{ dayobject.day.getDate() }}
                    <div>1吨</div>
                  </div>
                  <div
                    :class="{'otherday':dayobject.day.getDate() === otherDay}"
                    v-else
                    @click="getDayMessage(currentYear,currentMonth,dayobject.day.getDate())"
                  >{{ dayobject.day.getDate() }}
                    <div>1吨</div>
                  </div> -->
                  <!-- 新加代码 -->
                  <div>{{dayobject.day.getDate()}}
                    <!-- 吨 -->
                    <div style="color:#51ce82;">{{dayobject.num}}</div>
                  </div>
                  <div :class="{'circle':dayobject.status==='3','o':dayobject.status==='2'}"></div>
                </div>
              </li>
            </ul>
            <!--背景色-->
            <div class="background" :class="{'change':isChange}">
              <div v-for="(value,index) in 5" :class="{'dbg':(index%2===0),'lbg':(index%2!==0)}" :key="index"></div>
            </div>
          </div>
        </div>
        <div class="kr-buttom">
          <div>
            <span>用水数据每天进行更新</span>
          </div>
          <div>
            <span>数据仅供参考，抄表计费以实际用水为单位</span>
          </div>
        </div>
      </div>
      <!-- </van-pull-refresh> -->
    </page-content>

  </div>
</template> 
 
<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import { Icon, PullRefresh, Toast } from 'vant';
export default {
  components: {
    myHeader,headerThree
  },
  data() {
    return {
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      status: 2,//1 有漏水 2 无漏水
      result: "",
      user: "小胖子",
      header: require('../../../../../static/img/header1.png'),
      formData: {
        groupArea: "",
        userName: "",
        userNo: "",
        userAddress: "",
      },
      message: {
        title: "",
        span1: "",
        span2: "",
        isShow: '',
      },

      currentDay: 1,
      // currentMonth: new Date().getMonth() + 1,
      // currentYear: new Date().getFullYear(),
      currentMonth: '',
      currentYear: '',
      currentWeek: 1,
      newWeek: 1,
      days: [],
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      // 上下滑动的鼠标位置
      positionSX: "",
      positionEX: "",
      positionSY: "",
      positionEY: "",
      isChange: false,
      // 左右滑动动画的初始状态
      show: true,
      fadeOut: false,
      fadeIn: false,
      fadeOutR: false,
      fadeInR: false,
      monthList: [],
      status: "",
      otherDay: "",

      needData: [],
      newDay: '',
    };
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 5)
        return value.slice(0, 5) + '...'
      else
        return value
    }
  },
  created() {

  },
  mounted() {
    $('#myTitle').html('用水分析')
    // this.init();
    console.log(this.$route.query);
    this.formData.groupArea = this.$route.query.groupArea;
    this.formData.userName = this.$route.query.userName;
    this.formData.userNo = this.$route.query.userNo;
    this.formData.userAddress = this.$route.query.userAddress;
    this.message = {
      title: "用水分析",
      span1: this.formData.groupArea,
      span2: this.formData.userName + ' (' + this.formData.userNo + ')',
      span3: this.formData.userAddress,
      status: 0,
      warning1: '疑似漏水！',
      warning2: this.result,
    };
    this.currentYear = this.$route.query.month.slice(0, 4)
    this.currentMonth = this.$route.query.month.slice(4)
    console.log(this.currentMonth);
    this.getNeedData();
    this.initShow()
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
        this.init();
        this.getNeedData();
        this.initShow()
      }, 500);
    },
    // 模块访问
    moduleAccess(groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': '5',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
    },
    init() {
      let that = this;
      let data = {
        userNo: localStorage.getItem('userNo'),
        area: localStorage.getItem('groupCode'),
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/bindUserBill',//接口地址
      }).then(res => {
        // _this.moduleAccess(_this.$route.query.groupCode)
        that.formData.userName = res.userName;
        that.formData.userNo = res.userNo;
        that.formData.userAddr = res.userAddr;
        that.formData.totalArrearage = res.totalArrearage;
        that.formData.totalPay = res.totalPay;
        that.formData.accountBalance = res.accountBalance;
      })
    },
    initShow() {
      let that = this;
      let data = {
        // userNo: "008900628",
        // groupCode: "C021012",
        userNo: that.$route.query.userNo,
        groupCode: that.$route.query.groupCode,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/waterLoseQuery.api',//接口地址
      }).then(res => {
        that.status = res.status;
        that.result = res.result;
        that.message.warning2 = res.result
        that.message.status = res.status
      })
    },
    getNeedData() {
      let that = this;
      let str = '';
      let cur = '';
      let year = that.currentYear;
      let month = that.currentMonth;
      if (parseInt(month) < 10) {
        month = '0' + parseInt(month);
      }
      // str = that.$route.query.month;
      str = year.toString() + month.toString();
      cur = year.toString() + '-' + month.toString() + '-01';
      let data = {
        // userNo: "008900628",
        // groupCode: "C021012",
        userNo: that.$route.query.userNo,
        groupCode: that.$route.query.groupCode,
        month: str,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/dayFluxQuery.api',//接口地址
      }).then(res => {
        that.needData = res;
        that.initData(cur);
      })
    },
    getDayMessage(y, m, d) {
      this.getCurrentWeek(y, m, d);
      const str = this.formatDate(y, m, d);
      this.$emit("change", str, m, d);
      this.otherDay = d;
    },
    getCurrentWeek(y, m, d) {
      const w = `${y}-${m}-${d}`
      const weekArr = w.split('-');
      const weeks = new Date(weekArr[0], parseInt(weekArr[1] - 1), weekArr[2]);
      this.newWeek = weeks.getDay();
    },
    otherMonth(day) {
      if (day < 15) {
        this.rightSliding()
      } else if (day > 15) {
        this.leftSliding()
      }
    },
    addSchedule() {
      this.$emit('add')
    },
    //向下滑监听坐标
    allTouchStart(e) {
      //开始x轴坐标
      this.positionSX = e.changedTouches[0].clientX;
      //开始y轴坐标
      this.positionSY = e.changedTouches[0].clientY;
    },
    allTouchEnd(e) {
      //结束x轴坐标
      this.positionEX = e.changedTouches[0].clientX;
      //结束y轴坐标
      this.positionEY = e.changedTouches[0].clientY;
      const distanceY = this.positionEY - this.positionSY;
      const distanceX = this.positionSX - this.positionEX;
      //判断滑动的方向
      if (distanceY < -30 && Math.abs(distanceY) > Math.abs(distanceX)) {
        this.isChange = true;
      }
      if (distanceY > 30 && Math.abs(distanceY) > Math.abs(distanceX)) {
        this.isChange = false;
      }
    },

    //监听左右滑动坐标
    touchStart(e) {
      //开始x轴坐标
      this.positionSX = e.changedTouches[0].clientX;
      //开始y轴坐标
      this.positionSY = e.changedTouches[0].clientY;
    },
    touchEnd(e) {
      this.show = !this.show;
      //结束x轴坐标
      this.positionEX = e.changedTouches[0].clientX;
      //结束y轴坐标
      this.positionEY = e.changedTouches[0].clientY;
      const distanceY = this.positionEY - this.positionSY;
      const distanceX = this.positionSX - this.positionEX;
      //判断滑动 的方向
      if (distanceX > 30 && Math.abs(distanceY) < Math.abs(distanceX)) {
        this.rightSliding()
      }
      if (distanceX < -30 && Math.abs(distanceY) < Math.abs(distanceX)) {
        this.leftSliding()
      }
    },
    takeChage(i) {
      if (i == 0) {
        this.leftSliding();
      } else {
        this.rightSliding();
      }
    },
    //向右滑动
    rightSliding() {
      let bool = '';
      if (this.currentYear < new Date().getFullYear()) {
        bool = true;
      } else if (this.currentYear == new Date().getFullYear() && this.currentMonth < new Date().getMonth() + 1) {
        bool = true;
      } else {
        bool = false;
      }
      if (!bool) {
        Toast.fail('只能查看' + (new Date().getFullYear()) + '年' + (new Date().getMonth() + 1) + '月之前的数据。')
      } else {
        const self = this;
        self.pickNext(self.currentYear, self.currentMonth);
        self.fadeOut = true;
        self.fadeIn = false;
        self.fadeInR = false;
        self.fadeOutR = false;
        setTimeout(function () {
          self.fadeIn = true;
          self.fadeOut = false;
          self.fadeOutR = false;
          self.fadeInR = false;
        }, 300);
      }
    },
    //向左滑动
    leftSliding() {
      const self = this;
      self.pickPre(self.currentYear, self.currentMonth);
      self.fadeOutR = true;
      self.fadeInR = false;
      self.fadeOut = false;
      self.fadeIn = false;
      setTimeout(function () {
        self.fadeInR = true;
        self.fadeOutR = false;
        self.fadeOut = false;
        self.fadeIn = false;
      }, 300);
    },
    initData(cur) {
      let that = this;
      let date;
      if (cur) {
        date = new Date(cur);
      } else {
        const now = new Date();
        const t = this.formatDate(now.getFullYear(), now.getMonth(), 1);
        const d = new Date(t);
        d.setDate(42);
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      }

      this.currentDay = date.getDate();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.currentWeek = date.getDay();
      if (!cur || !this.otherDay) {
        this.otherDay = new Date().getDate();
      }
      const str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      );
      this.days.length = 0;
      //初始化本周
      for (let i = this.currentWeek; i >= 0; i--) {
        const d = new Date(str);
        d.setDate(d.getDate() - i);
        const dayobject = {}; //用一个对象包装Date对象 以便为以后预定功能添加属性
        dayobject.day = d;
        dayobject.status = "";
        if (that.needData.length > 0) {
          dayobject.num = that.needData[0].value;//新加代码
        }
        this.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
      }
      //其他周
      for (let i = 1; i <= 41 - this.currentWeek; i++) {
        const d = new Date(str);
        d.setDate(d.getDate() + i);
        const dayobject = {};
        dayobject.day = d;
        dayobject.status = "";
        if (i < that.needData.length) {
          dayobject.num = that.needData[i].value;//新加代码
        }
        this.days.push(dayobject);
      }
      //选中日期在其他月份是否超出最大日期判断
      const arr = []
      for (let j = 0, length = this.days.length; j < length; j++) {
        if (this.days[j].day.getMonth() + 1 === this.currentMonth) {
          arr.push(this.days[j].day.getDate())
        }
      }
      const maxDate = Math.max.apply(null, arr);
      if (this.otherDay > maxDate) {
        this.otherDay = maxDate
      }

      this.getDayMessage(this.currentYear, this.currentMonth, this.otherDay)

    },
    //上个月信息
    pickPre(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      this.newDay = d;
      d.setDate(0);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.getNeedData();
    },
    //下个月信息
    pickNext(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      this.newDay = d;
      d.setDate(42);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.getNeedData();
    },
    // 补零处理
    formatDate(year, month, day) {
      let y = year;
      let m = month;
      if (m < 10) m = "0" + m;
      let d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    }
  }
};
</script>
 
<style lang="less" scoped>
.new-data {
  #calendar {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    transition: all 0.5s;
    overflow: hidden;
    background: #fafafa;
    .change {
      height: 250px !important;
    }
    .year-month {
      // height: 80px;
      height: 3rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .year-month_left {
        height: 100%;
        // width:80%;
        width: 100%;
        // padding-left: 25px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .top-time {
          color: #333;
          font-size: 16px;
          font-weight: 500;
          // margin-right: 15px;
        }
        .top-tite {
          font-size: 16px;
          font-weight: 500;
          // margin-right: 10%;
          margin-right:5%; 
          color: #3193f6;
        }
        .top-time1 {
          color: #000;
          font-size: 16px;
          font-weight: 500;
          // margin-right: 10%;
          margin-right:5%; 
        }
        .kr-span3 {
          width: 24%;
          // padding: 0 4%;
          padding:0% 0%;
          line-height: 100%;
          float:right;
          .van-icon {
            font-size: 24px;
          }
          .van-icon-arrow-down {
            margin-left: 10%;
          }
        }
        ul {
          display: flex;
          flex-direction: column;
          li {
            color: #444;
            font-size: 16px;
          }
        }
      }
      .year-month_right {
        height: 100%;
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 12px;
        .i-plus-empty {
          fill: #f18d2f;
        }
      }
    }
    .weekdays {
      margin: 0;
      height: 40px;
      font-size: 15px;
      display: flex;
      flex-wrap: wrap;
      color: #666;
      justify-content: space-around;
      li {
        display: inline-block;
        width: 13.6%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .days {
      height: 290px;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      overflow: hidden;
      position: relative;
      li {
        list-style-type: none;
        display: inline-block;
        height: 42px;
        width: 13.4%;
        text-align: center;
        font-size: 14px;
        color: #000;
        position: relative;
        .active {
          border-radius: 50%;
          background: #3a8fea;
          color: #fff;
          width: 40px;
          height: 40px;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .other-month {
          width: 40px;
          height: 40px;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #a2a2a2;
        }
        .everyDay {
          width: 40px;
          height: 40px;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .circle {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #f2553d;
          position: absolute;
          bottom: 6px;
          left: 48%;
        }
        .o {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          border: 1px solid #f2553d;
          position: absolute;
          bottom: 1px;
          left: 49%;
        }
        .otherday {
          width: 38px;
          height: 38px;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          border: 1px solid #b2b2b2;
        }
      }
    }
    .fadeOut {
      animation-name: fadeOut;
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
    }
    .fadeOutR {
      animation-name: fadeOutR;
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
    }
    .fadeIn {
      animation-name: fadeIn;
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
    }
    .fadeInR {
      animation-name: fadeInR;
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
    }
    .background {
      position: absolute;
      top: 100px;
      height: 211px;
      width: 100%;
      z-index: -1;
      overflow: hidden;
      transition: all 0.5s;
      .dbg {
        background-color: #e1e1e1;
        height: 42.2px;
      }
      .lbg {
        background-color: #d5d5d5;
        height: 42.2px;
      }
    }
  }
  .content-padded {
    margin: 0;
    height: 30%;
    .row {
      height: 100%;
      .col-100 {
        height: 100%;
        .user-card {
          height: 100%;
        }
      }
    }
  }
  .col-100 {
    background: #fff;
    .user-card {
      // border-radius: 10px;
      padding: 15px;
      background: url("../../../../../static/img/shuidi.png") no-repeat;
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
        padding-top: 10px;
        ul {
          width: 60%;

          li {
            color: #fff;
            padding: 7px;
            font-weight: 300;
            b {
              font-weight: 300;
            }
            font-size: 15px;
          }
        }
        ol {
          width: 40%;
          .kr-img {
            text-align: center;
          }
          li {
            // padding: 7px;
            a {
              display: inline-block;
              color: #3193f6;
            }
            p {
              text-align: left;
              color: red;
              font-family: PingFang_Bold;
              font-size: 15px;
            }
          }
        }
      }
    }
  }
  .kr-row {
    margin: 0;
    height: 70%;
    .kr-top {
      height: 85%;
      background: #fff;
    }
    .kr-buttom {
      height: 15%;
      text-align: center;
      span {
        display: inline-block;
        font-size: 13px;
        font-family: PingFang_Regular;
        color: #3193f6;
      }
    }
  }
}

@keyframes fadeOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
@keyframes fadeIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fadeOutR {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
@keyframes fadeInR {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>