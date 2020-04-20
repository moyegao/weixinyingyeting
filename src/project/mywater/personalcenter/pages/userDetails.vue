<template>
  <div class="user-details">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>用户详情</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title="title"></myHeader> -->
        <!-- <headerThree :message = 'message'></headerThree> -->
        <div class="row info_content" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <div class="col-100">
            <div class="user-card-bg">
              <div class="kr-span">
                <span class="kr-span-left">
                  <van-icon name="user-o" />&nbsp;&nbsp;客户信息</span>
                <span class="kr-span-right" v-if="tableData.ctmCount > 1">提醒:您名下有{{tableData.ctmCount}}个客户,建议合并</span>
              </div>
              <van-field class="yh-my-blue" v-model="tableData.ctmNo" label="客户编号" left-icon="user-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="tableData.ctmName" label="客户名称" left-icon="user-o" size="large" disabled />
              <!-- <van-field class="yh-my-blue" label="客户地址"  left-icon="comment-o" size="large" /> -->
              <!-- <van-cell-group> -->
              <van-field class="yh-my-blue" label="客户地址" left-icon="location-o" size="large" v-model="tableData.ctmAddress" rows="1" autosize type="textarea" disabled placeholder="" />
              <!-- </van-cell-group> -->
              <van-field class="yh-my-red" v-model="tableData.ctmType" label="客户类型" left-icon="apps-o" size="large" disabled />
              <van-field class="yh-my-blue" v-model="tableData.contactName" left-icon="contact" label="联系人" disabled placeholder="" size="large" />
              <van-field class="yh-my-red" v-model="tableData.mobile" label="联系人手机号码" left-icon="phone-o" size="large" disabled />
            </div>
            <div class="yh-kongge"></div>
            <div class="user-card-bg">
              <div class="kr-span">
                <span class="kr-span-left">
                  <van-icon name="bill-o" />&nbsp;&nbsp;账户信息</span>
                <span class="kr-span-right" v-if="tableData.ctmCount > 1">提醒:您名下有{{tableData.ctmCount}}个客户,建议合并</span>
              </div>
              <van-field class="yh-my-blue" v-model="tableData.accountNo" label="账户编号" left-icon="user-circle-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="tableData.bankName" label="开户行" left-icon="shop-o" size="large" disabled rows="1" autosize type="textarea"/>
              <van-field class="yh-my-blue" v-model="tableData.accountName" label="开户名" left-icon="user-circle-o" size="large" disabled rows="1" autosize type="textarea"/>
              <van-field class="yh-my-red" v-model="tableData.bankAccount" label="银行账户" left-icon="contact" size="large" disabled />
              <van-field class="yh-my-blue" v-model="tableData.invoiceType" label="发票类型" left-icon="label-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="tableData.invoiceTitle" label="发票抬头" left-icon="shop-collect-o" size="large" disabled />
              <van-field class="yh-my-blue" v-model="tableData.sendWay" label="投递方式" left-icon="apps-o" size="large" disabled />
            </div>
            <div class="yh-kongge"></div>
            <div class="user-card-bg">
              <div class="kr-span">
                <span class="kr-span-left">
                  <van-icon name="label-o" />&nbsp;&nbsp;用户-基础信息
                </span>
              </div>
              <van-field class="yh-my-blue" v-model="tableData.userNo" label="用户编号" left-icon="manager-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="tableData.userStatus" label="用户状态" left-icon="coupon-o" size="large" disabled />
              <!-- <van-field class="yh-my-blue" label="装表地址"  left-icon="comment-o" size="large" /> -->
              <!-- <van-cell-group> -->
              <van-field class="yh-my-blue" label="装表地址" left-icon="location-o" size="large" v-model="tableData.userAddress" rows="1" autosize type="textarea" disabled placeholder="" />
              <!-- </van-cell-group> -->
              <van-field class="yh-my-red" v-model="tableData.readCycle" label="抄表周期" left-icon="underway-o" size="large" disabled />
              <van-field class="yh-my-blue" v-model="tableData.waterType" label="用水类型" left-icon="apps-o" size="large" disabled />
              <van-field class="yh-my-red" v-model="tableData.waterPeople" label="用水人口" left-icon="friends-o" size="large" disabled />
            </div>

          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>

<script>
import { PullRefresh, Icon } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      message: {
        title: "用户详情",
        span1: "足不出户",
        span2: "在家看用户详情",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: '用户详情',
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
      tableData: {},
    }
  },
  mounted() {
    $('#myTitle').html(this.title)
    this.init();
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
      }, 500);
    },

    //用户详情初始化
    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": this.$route.query.groupCode,
          "userNo": this.$route.query.userNo
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/userInfoQuery',//接口地址
      }).then(res => {
        _this.tableData = res
      })
    },
    log(m) {
      console.log(m || 'log')
    }
  }
}
</script>

<style scoped lang="less">
.user-details {
  height: 100%;
  .kr-span-title {
    color: #888 !important;
  }
  .list ul:after {
    background-color: white;
  }
  .list li + li .item-content:before {
    background-color: white;
  }
  .list ul:before {
    height: 0px;
  }
  .user_msg {
    // font-family: PingFang_Medium;
  }
  .info_content {
    height: 100%;
    overflow: auto;
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
    .user-card-bg {
      background-size: 102%;
      background: #eee;
      // padding: 0 2%;
      // box-shadow: 1px 1px 5px 1px #888888;
      border-radius: 5px;
      .kr-span {
        // padding: 12px 2px;
        padding:12px 16px;
        width: 100%;
        border-bottom: 1px solid #eee;
        background: #fff;
        span {
          display: inline-block;
          font-size: 13px;
        }
        .kr-span-right {
          float: right;
          color: #ed702d;
          border-bottom: 1px solid #ed702d;
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
      .van-cell {
        border-bottom: 1px solid #eee;
        // padding: 10px 5px;
        padding:10px 16px;
      }
      .list {
        margin: 0;
        // padding: 0.5rem 0;
        padding: 0 0 0.4rem 0;
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
          // padding:0;
          .item-title-row {
            div {
              display: inline-block;
              border-bottom: #eee solid 1px;
              padding-left: 0.25rem;
              span {
                font-size: 0.7rem;
                color: #000;
              }
              input {
                width: 90%;
                font-size: 0.6rem;
                // color: #989898;
                color: #000;
                border: none;
              }
            }
            .first_content {
              width: 45%;
            }
            .second_content {
              width: 100%;
            }
            .Third_content1 {
              width: 23%;
            }
            .Third_content2 {
              width: 35%;
            }
            .Third_content3 {
              width: 40%;
            }
            .kr-span {
              width: 100%;
              // padding: 0.4rem 0.75rem 0.2rem 0.25rem;
              border-bottom: 0;
              span {
                display: inline-block;
                font-size: 13px;
              }
              .kr-span-right {
                float: right;
                color: #ed702d;
                border-bottom: 1px solid #ed702d;
                a {
                  color: #ed702d;
                }
              }
              .kr-span-left {
                font-size: 0.8rem;
                float: left;
                display: flex;
                align-items: center;
                color: #489eff;
              }
            }
          }
        }
      }
    }
    .yh-kongge {
      height: 0.5rem;
      background: #eee;
    }
  }
}
</style>