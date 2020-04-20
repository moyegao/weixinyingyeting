<template>
  <!-- <div class="personal-center" v-if="!notFoundShow"> -->
  <div class="personal-center">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>个人中心</header-title>
    </page-header> -->
    <page-content>
      <van-overlay :show="show" @click="show = false">
        <div class="kr-zhezhao" v-show="isNews">
          <div class="yh-top">
            消息订阅
          </div>
          <div class="yh-buttom">
            <div>
              <div @click="takeChange()" style="display: inline-block;width:46%">
                <span style="text-align: center;">账单通知</span>
                <img src="../../../../static/img/kaiguan1.png" alt="" v-if="!isChange">
                <img src="../../../../static/img/kaiguan2.png" alt="" v-if="isChange">
              </div>
              <div @click="takeChange3()" style="display: inline-block;width:50%">
                <span>缴费成功通知</span>
                <img src="../../../../static/img/kaiguan1.png" alt="" v-if="!isChange3">
                <img src="../../../../static/img/kaiguan2.png" alt="" v-if="isChange3">
              </div>
            </div>
            <div>
              <!-- <span @click="takeChange2()">停水通知</span>
              <img src="@/project/assets/img/kaiguan1.png" alt="" v-if="isChange2" @click="takeChange2()">
              <img src="@/project/assets/img/kaiguan2.png" alt="" v-if="!isChange2" @click="takeChange2()"> -->

            </div>
          </div>
        </div>
      </van-overlay>

      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content-padded" id="body">
          <headerThree :message='message'></headerThree>
          <div class="row add_box" v-if="contentShow">
            <div class="col-100">
              <div class="midle-bar">
                <b></b>
                <router-link :to="{ path: 'accountBind' }" @click="event.stopPropagation()" style="z-index: 1000">
                  <img src="../../../../static/img/plus.png" alt="">
                </router-link>
              </div>
            </div>
          </div>

          <div class="kr-body" v-if="!contentShow">
            <div class="kr-containt">
              <div class="kr-top">
                <img src="../../../../static/img/youzhi.png" alt="">
              </div>
              <div class="kr-middle">
                <p>Hi,</p>
                <p>您还没有绑定水表，绑定后将享受到</p>
                <p>更便捷更优质的用水服务</p>
              </div>
              <div class="kr-buttom">
                <router-link :to="{ path: 'accountBind' }">
                  <m-button size="big" type="danger">
                    立即体验
                  </m-button>
                </router-link>
              </div>
            </div>
          </div>

          <div class="row" id="detail_box" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div class="col-100" style="margin-left: 2%;">
              <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
                <van-cell v-for="item in tableData" :key="item.userNo + item.groupCode" class="user-card-bg"> -->
              <div v-for="item in tableData" :key="item.userNo + item.groupCode" class="user-card-bg">
                <div class="card-content">
                  <ul style="padding: 15px 15px 0px 15px;border-bottom: 2px solid #EFEFEF">
                    <li>
                      <span>
                        <a @click="goUserDetails(item)" class="kr-user-details">
                          <m-button size="small" :round="true" type="#479EFF">
                            <img src="../../../../static/img/zhangdan.png" alt="" class="details_img" style="width:15px;height:15px;display: inline-block;vertical-align: middle;">
                            <span>用户详情</span>
                          </m-button>
                        </a>
                      </span>
                      <span class="user_msg">{{item.userName}}（{{item.userNo}}）</span>
                    </li>
                    <li>
                      <span class="user_msg">{{item.userAddress}}</span>
                    </li>
                  </ul>
                  <ol style="padding: 0 0px 0px 0px;">
                    <li style="border-right: 1px solid #E4E4E4">
                      <a class="bar-grid" @click="goNewData(item)">
                        <div class="grid-icon">
                          <img src="../../../../static/img/yongshuifenxi.png" alt="" style="width:33px; height: 33px;margin-top: 10%;">
                        </div>
                        <p class="grid_label">
                          用水分析
                        </p>
                      </a>
                    </li>
                    <li style="border-right: 1px solid #E4E4E4">
                      <a class="bar-grid" @click="goContacts(item)">
                        <div class="grid-icon">
                          <img src="../../../../static/img/lianxiren.png" alt="" style="width:33px; height: 33px;margin-top: 10%;">
                        </div>
                        <p class="grid_label">
                          联系人
                        </p>
                      </a>
                    </li>
                    <li style="border-right: 1px solid #E4E4E4">
                      <a class="bar-grid">
                        <div class="grid-icon" @click="newsFeed(item)">
                          <img src="../../../../static/img/xiaoxidingyue.png" alt="" style="width:40px; height: 25px;margin-top: 10%;">
                        </div>
                        <p class="grid_label">
                          消息订阅
                        </p>
                      </a>
                    </li>
                    <li>
                      <div class="grid-icon" @click="unbind(item)">
                        <img src="../../../../static/img/jiechubangding.png" alt="" style="width:33px; height: 33px;margin-top: 10%;">
                      </div>
                      <p class="grid_label">
                        解除绑定
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
              <!-- </van-cell>
              </van-list> -->
            </div>
          </div>
          <div class="row bottom_box" @click="goWaterConcerns" v-if="WaterConcernsShow">
            <!-- <van-divider 
                        dashed 
                        :style="{color:'gray',borderColor:'gray',fontSize: '18px'}">
                        {{waterConcernsData.length > 0?'我关注的地区':'我还没有关注地区'}}
            </van-divider> -->
            <div class="header">
              <span class="line"></span>
              <span class="text">{{waterConcernsData.length > 0?'我关注的地区':'我还没有关注地区'}}</span>
              <span class="line"></span>
            </div>
            <div class="bottom_explain" v-if="waterConcernsData.length == 0">
              关注地区后可接收停水通知或其它重要公告信息
            </div>
            <div class="bottom_item" v-for="item in waterConcernsData" :key="item.groupCode">
              {{item.groupArea}}
            </div>
            <div class="bottom_more">
              <img src="../../../../static/img/starblue.png" alt="" style="vertical-align: -1px;">
              {{waterConcernsData.length > 0?'关注更多地区':'立即关注'}}
            </div>
          </div>

        </div>
      </van-pull-refresh>
    </page-content>
  </div>
  <!-- <waterConcerns v-else></waterConcerns> -->
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
// import waterConcerns from '../waterConcerns'
import { Toast, Dialog, PullRefresh } from 'vant';
export default {
  components: {
    myHeader, headerThree,
    // waterConcerns
  },
  data() {
    return {
      message: {
        title: "个人中心",
        span1: "尊敬的" + (localStorage.getItem('nickname') === null ? 'XX' : localStorage.getItem('nickname')),
        span2: "以下为您已绑定的账户信息、已关注的地区信息",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,


      show: false,
      // notFoundShow: false,
      title: '个人中心',
      user: "小胖子",
      // header: require('@/project/assets/img/header.png'),
      // rabbit: require('@/project/assets/img/rabbit.jpg'),
      isChange: false,
      isChange1: false,
      isChange2: false,
      isChange3: false,
      isNews: false,
      list: [
        {
          title: '用户编号',
          content: '张三（10011110001）'
        },
        {
          title: '用户地址',
          content: '步埠路四级39号'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        },
        {
          name: '充值'
        },
        {
          name: '缴费'
        }
      ],

      // 用户列表
      tableData: [],
      // 消息订阅
      msgData: [],
      // 地区关注数据
      waterConcernsData: [],
      // 显示和隐藏加号按钮与未绑定水表样式
      contentShow: true,
      // 控制关注地区的显示
      WaterConcernsShow: false,
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 3)
        return value.slice(0, 3) + '...'
      else
        return value
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.WaterConcernsShow = false
    this.$store.state.notFound = 3
    this.init()
    this.getWaterConcernsData()
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
        this.getWaterConcernsData()()
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
        if (this.tableData.length) {
          this.finished = true;
        }

      }, 500);
    },
    // 获取关注地区列表
    getWaterConcernsData() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "openId": localStorage.getItem('openId'),
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/compLinkList',//接口地址
      }).then(res => {
        // 置空
        _this.waterConcernsData = []
        for (let i = 0; i < res.length; i++) {
          if (res[i].isLink == 1) {
            _this.waterConcernsData.push(res[i])
          }
        }
        _this.WaterConcernsShow = true
      })
    },
    // 跳转到地区关注页面
    goWaterConcerns() {
      this.$router.push({ path: 'waterConcerns' })
    },

    // 模块访问
    moduleAccess(groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': '7',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
    },
    // 获取用户数量，判断进多户或者单户页面
    getUserNum() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId')
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/bindUserCount',//接口地址
      }).then(res => {
        if (res.userCount != 0) {// 多户页面
          this.init()
        } else {
          // _this.notFoundShow = true
          // this.$router.push({ path: 'waterConcerns' })
        }
      })
    },
    // 获取用户列表
    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
        }
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/selfUserList',//接口地址
      }).then(res => {
        if (res.length >= 1) {
          localStorage.setItem('userNo', res[0].userNo)
          localStorage.setItem('groupCode', res[0].groupCode)
        } else if (res.length == 0) {
          // _this.notFoundShow = true
          localStorage.setItem('userNo', '')
          localStorage.setItem('groupCode', '')
        }
        _this.tableData = res
        // 显示和隐藏加号按钮与未绑定水表样式
        if (_this.tableData.length > 0) {
          _this.contentShow = true
        }else{
          _this.contentShow = false
        }
      })
    },
    // 获取消息订阅数据
    getMsgData(item) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "openId": localStorage.getItem('openId'),
          "groupCode": item.groupCode,
          "userNo": item.userNo
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/subscribeQuery',//接口地址
      }).then(res => {
        // _this.moduleAccess(item.groupCode)
        _this.isNews = true;
        // $('.page-content').css('overflow', 'hidden')

        _this.msgData = res[0]
        _this.msgData.groupCode = item.groupCode
        _this.msgData.userNo = item.userNo
        // 账单通知
        if (_this.msgData.bill_notice == '0') {
          _this.isChange = false
        } else if (_this.msgData.bill_notice == '1') {
          _this.isChange = true
        }
        // 缴费通知
        if (_this.msgData.pay_notice == '0') {
          _this.isChange3 = false
        } else if (_this.msgData.pay_notice == '1') {
          _this.isChange3 = true
        }
      })
    },
    // 修改消息订阅数据
    updateMsgData() {
      var _this = this;
      // 判断用户有没有修改消息订阅内容，若没有则不调接口
      // let bill = ''
      // let pay = ''
      // if (this.isChange) {
      //   bill = 1
      // } else {
      //   bill = 0
      // }
      // if (this.isChange3) {
      //   pay = 1
      // } else {
      //   pay = 0
      // }
      // if (bill == _this.msgData.bill_notice && pay == _this.msgData.pay_notice) {
      //   return
      // }

      let params = {//接口入参
        "data": {
          "groupCode": _this.msgData.groupCode,
          "openId": localStorage.getItem('openId'),
          "userNo": _this.msgData.userNo,
          "notice": {
            "bill_notice": 0,
            "pay_notice": 0
          }
        },
      }
      if (this.isChange) {
        params.data.notice.bill_notice = 1
      } else {
        params.data.notice.bill_notice = 0
      }
      if (this.isChange3) {
        params.data.notice.pay_notice = 1
      } else {
        params.data.notice.pay_notice = 0
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/subscribeUpdate',//接口地址
      }).then(res => {
        Toast.success('修改消息订阅信息成功！');
      })
    },
    // 跳转联系人列表页面
    goContacts(item) {
      this.$router.push({ path: '/contacts', query: item })
    },
    // 跳转用户详情页面
    goUserDetails(item) {
      this.$router.push({ path: '/userDetails', query: item })
    },
    // 解除绑定
    unbind(item) {
      var _this = this;
      Dialog.confirm({
        // title: '标题',
        message: '是否确定解除绑定？'
      }).then(() => {
        let params = {//接口入参
          "data": {
            'openId': localStorage.getItem('openId'),
            'groupCode': item.groupCode,
            'userNo': item.userNo,
          },
        }
        this.$api.fetch({
          params: params,//参数
          apiUrl: '/myWater/userUnbind',//接口地址
        }).then(res => {
          Toast.success('解除绑定成功！');
          setTimeout(() => {
            _this.init()
            _this.getWaterConcernsData()
          }, 2000);
        })
      }).catch(() => {
        return
      });


    },
    goNewData(item) {
      this.$router.push({ path: '/waterAnalyze', query: item })
      // if (item.isAIMeter == 0) {
      //   Toast({
      //     message: '对不起，非智能表不支持此功能',
      //     position: 'middle',
      //     duration: 2000
      //   })
      // } else {
      //   this.$router.push({ path: '/waterAnalyze', query: item })
      // }
    },

    log(m) {
      console.log(m || 'log')
    },
    newsFeed(item) {
      this.show = true
      event.stopPropagation();//阻止冒泡事件
      this.getMsgData(item)
    },

    takeChange() {
      event.stopPropagation();//阻止冒泡事件
      if (!this.isChange) {
        this.isChange = true;
      } else {
        this.isChange = false;
      }
      this.updateMsgData()
    },
    takeChange3() {
      event.stopPropagation();//阻止冒泡事件
      if (!this.isChange3) {
        this.isChange3 = true;
      } else {
        this.isChange3 = false;
      }
      this.updateMsgData()
    },
  }
}
</script>

<style scoped lang="less">
.personal-center {
  .header{
    width:100%;
    height:36px;
    line-height:36px;
    text-align:center;
  }
  .line{
    display:inline-block;
    width:25%;
    border-top:1px dashed #cccccc;
    vertical-align:5px;  
  }
  .van-overlay {
    z-index: 1001 !important;
  }
  .kr-user-details {
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        margin-left: 10%;
      }
    }
  }
  #detail_box {
    // height: 70%;
    // overflow: scroll;
  }
  .page-content {
    // overflow: hidden;
  }
  //点击禁用
  .disabled1 {
    pointer-events: none;
  }

  .user_msg {
    // font-family: PingFang_Medium;
  }
  .img_content {
    // height: 10rem;
    height: 9rem;
    width: 100%;
    background: url("../../../../static/img/juxing.png") no-repeat;
    background-size: 100% 100%;
  }
  .add_box {
    margin-top: -1rem;
    // position: absolute;
    // width: 100%;
    // top:8rem;
    // height: 10%;
  }
  .add_content {
    display: inline-block;
    position: absolute;
    top: 28.5%;
    right: 10px;
    font-size: 50px;
    color: #fff;
    // background: #ed702d;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
  }
  .content-padded {
    margin: 0;
    // height: 100%;
  }
  .kr-zhezhao {
    width: 94%;
    background-color: #fff;
    position: absolute;
    left: 3%;
    top: 79%;
    z-index: 2000;
    .yh-top {
      padding: 10px 0;
      text-align: center;
      background: #489eff;
      color: #fff;
      // font-family: PingFang_Bold;
    }
    .yh-buttom {
      padding: 3%;
      > div {
        width: 100%;
        padding: 4px 0;
        // text-align: center;
        span {
          display: inline-block;
          width: 66%;
          // font-family: PingFang_Bold;
          font-size: 15px;
        }
        img {
          margin: 0 auto;
          display: inline-block;
          vertical-align: middle;
          width: 24%;
        }
      }
    }
  }
  .zhezhao {
    width: 100%;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.3);
    // filter:alpha(opacity=50);
    position: absolute;
    left: 0px;
    top: 0px;
    // display:none;
    z-index: 1000;
    .card-content {
      ul {
        // border-bottom: 2px solid rgba(239, 239, 239, 0.1) !important;
        li {
          a {
            opacity: 0.7;
          }
        }
      }
      ol {
        li {
          // border-right: 1px solid rgba(228, 228, 228, 0.1) !important;
        }
      }
    }
    .add_box {
      .midle-bar {
        a {
          opacity: 0.7;
        }
      }
    }
  }
  .row {
    margin-left: 0%;
  }
  .col-100 {
    .user-card {
      border-radius: 10px;
      padding: 27% 0 0 0;
      /*background: url('../../../project/assets/img/grzx-bg.png') no-repeat;*/
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
          /*color: #fff;*/
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        // border-bottom: 1px solid #e7e7e7;
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        // padding: 0 0 0 0.75rem;
        position: relative;
        .left-img {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          padding: 0.25rem 0;
          width: 25%;
          img {
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
            /*width: 50%;*/
          }
        }
        .right-content {
          margin-left: 0.75rem;
          width: 100%;
          position: relative;
          padding: 0.9rem 0.75rem 0.4rem 0;
          color: #fff;
          h4,
          span {
            margin: 10px 0;
            /*color: #fff;*/
            font-size: 24px;
          }
          h4 {
            a {
              color: #fff;
              float: right;
              font-size: 15px;
              line-height: 27px;
              // font-family: PingFang_Regular;
              font-weight: 300;
              // padding-right: 15px;
              // border-bottom: 1px solid white;
              // background: url("../../../project/assets/img/fanhui.png")
              //   no-repeat;
              // background-position: right;
              // background-size: 9px;
              // b {
              //   text-decoration: underline;
              // }
            }
          }
          p {
            font-size: 16px;
            span {
              padding-left: 20px;
              background: url("../../../../static/img/coin.png") no-repeat;
              background-position: left bottom;
              background-size: 14px;
            }
          }
        }
      }
    }
    .grids-small {
      .grid {
        border: none;
        .grid-icon {
          // border: 1px solid red;
          // background: ;
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
      // a {
      //   font-size: 24px;
      //   color: #fff;
      //   background: #3193f6;
      //   height: 40px;
      //   width: 40px;
      //   text-align: center;
      //   line-height: 40px;
      //   border-radius: 50%;
      // }
    }
    .user-card-bg {
      padding: 0;
      margin-top: 5px;
      margin-bottom: 30px;
      border-radius: 10px;
      // padding: 15px;
      // background: url("../../../project/assets/img/sfcj-bg.png") no-repeat;
      background-size: 102%;
      box-shadow: 1px 1px 5px 1px #888888;
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
        position: relative;
        /*padding-top: 10px;*/
        ul {
          width: 100%;
          li {
            // color: #fff;
            padding: 7px;
            font-weight: 300;
            b {
              font-weight: 300;
            }
            font-size: 15px;
            a {
              // display: inline-block;
              color: #fff;
              // font-family: PingFang_Bold;
              float: right;
              border-radius: 3px;
            }
          }
        }
        ol {
          padding-top: 15px;
          overflow: hidden;
          width: 100%;
          li {
            float: left;
            width: 25%;
            .grid-icon {
              border: 0;
              /*background: #fff;*/
              height: 50px;
              width: 58px;
              margin: auto;
              /*height: 50%;*/
              /*width: 50%;*/
              text-align: center;
              line-height: 50px;
              border-radius: 50%;
              img {
                width: 100%;
                vertical-align: middle;
              }
            }
            .grid_label {
              text-align: center;
              border: 0;
              // color: #fff;
              margin-top: 5px;
              margin-bottom: 15px;
              color: #9a9a9a;
              // font-family: PingFang_Bold;
            }
          }
        }
      }
    }
  }
  .bottom_box {
    width: 100%;
    .bottom_explain {
      width: 100%;
      font-size: 16px;
      color: gray;
      text-align: center;
    }
    .bottom_item {
      width: 49%;
      display: inline-block;
      text-align: center;
      color: gray;
      font-size: 16px;
      padding: 5px;
    }
    .bottom_more {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #3193f6;
      padding: 5px;
    }
  }
  .van-list .van-cell__title {
    text-align: center;
    padding: 10px 16px;
  }

  .kr-body {
    padding: 10% 5%;
    height: 70%;
    // margin-top:10%;
    .kr-containt {
      box-shadow: 0px 1px 9px -1px #888;
      border-radius: 10px 10px 0px 0px;
      .kr-top {
        padding: 16px 10px 0 10px;
        text-align: center;
        img {
          width: 100px;
        }
      }
      .kr-middle {
        padding: 10px 0px 10px 5%;
        p {
          font-size: 16px;
        }
      }
      .kr-buttom {
        .button {
          height: 60px;
          line-height: 60px;
          border-radius: 0;
          // font-family: PingFang_Medium;
          font-size: 18px;
        }
        .button-danger {
          background: #ed702d;
        }
        .button-success {
          background: #49cc7c;
        }
      }
    }
  }

  // .order {
  //   height: 60px;
  //   line-height: 60px;
  //   text-align: center;
  // }
  // .order .line {
  //   display: inline-block;
  //   width: 135px;
  //   border-top: 1px dashed gray;
  // }
  // .order .txt {
  //   color: #686868;
  //   vertical-align: -5px;
  // }
}
</style>
