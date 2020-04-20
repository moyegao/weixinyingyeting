<template>
  <div class="contacts">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>联系人</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <headerTwo :showData="showData" :title="title"></headerTwo> -->
        <headerThree :message='message'></headerThree>
        <div class="row" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <div class="col-100">
            <div class="kr-body">
              <div class="kr-body-info Slide" v-if="tableData.length !== 0">
                <div class="kr-containt" v-for="item in tableData" :key="item.id" @click="goContactEdit(item)">
                  <van-swipe-cell :right-width="80">
                    <!-- <template slot="left">
                        <van-button square type="primary" text="选择" />
                      </template> -->

                    <div class="kr-div-parent">
                      <div class="kr-left">
                        <div class="kr-parent">{{item.name}} (<span>{{item.relation}}</span>)</div>
                        <div class="kr-phone">手机号码: <span>{{item.mobile}}</span>
                          <!-- <van-button type="info" class="del_btn" @click="delItem(item)">删除</van-button> -->
                        </div>
                        <div class="kr-phone">固定电话: <span>{{item.tel}}</span></div>
                      </div>
                      <!-- <div class="kr-right">
                          <a>
                            <icon icon="back"></icon>
                          </a>
                        </div> -->
                    </div>

                    <template slot="right">
                      <van-button square type="danger" text="删除" @click="delItem(item)" />
                    </template>
                  </van-swipe-cell>
                </div>
              </div>
              <div class="no-people" v-else>
                暂无联系人
              </div>
              <div class="kr-button" @click="addItem">
                <m-button size='large'>添加联系人</m-button>
              </div>
            </div>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>

    </page-content>
  </div>
</template>

<script>
import headerTwo from '@/comments/headerTwo'
import headerThree from '@/comments/headerThree';
import { Toast, PullRefresh } from 'vant';
import { Dialog } from 'vant';
export default {
  components: {
    headerTwo, headerThree
  },
  data() {
    return {
      title: '联系人',
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      message: {
        title: "",
        span1: "",
        span2: "",
        isShow: '',
      },
      user: "小胖子",
      list: [
        {
          title: '用户编号',
          content: '1001111'
        },
        {
          title: '用户名称',
          content: '*胖子'
        },
        {
          title: '用户地址',
          content: '步埠路39号'
        },

        {
          title: '所属水司',
          content: '梧州水司'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        }
      ],
      showData: {
        isShowUL: false,
        isShowLink: false,//是否显示链接
        isShowBtn: false,//是否显示按钮
        isShowCompany: true,
        userName: "",//"张三"
        userNo: "",//"100011"
        userAddress: "",//"广东省深圳市罗湖区太宁路85号罗湖科技大厦408号"
        groupName: '',
        accountBalance: "",//预存金额 "101"
        totalArrearage: "",//欠费总额 "302"
        totalPay: "",//合计应缴  "201"
      },

      // 联系人数据
      tableData: [],
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
        this.init();
      }, 500);
    },
    // 模块访问
    moduleAccess(groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': '6',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
    },
    // 获取联系人列表
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
        apiUrl: '/myWater/connecterList',//接口地址
      }).then(res => {
        // _this.moduleAccess(_this.$route.query.groupCode);
        _this.tableData = res.conList;
        _this.showData.userName = res.userName;
        _this.showData.userNo = res.userNo;
        _this.showData.userAddress = res.userAddress;
        _this.showData.groupName = res.groupName;
        _this.message = {
          title: "联系人",
          span1: _this.showData.userName + '(' + _this.showData.userNo + ')',
          span2: _this.showData.userAddress,
          span3: '所属水司：' + _this.showData.groupName,
          status: 0,
          warning1: '疑似漏水！',
        };
      })
    },
    //跳转到联系人信息修改页面
    goContactEdit(item) {
      item.content = 'edit'
      console.log(item);
      this.$router.push({ path: '/contactEdit', query: item })
    },
    // 添加联系人按钮
    addItem() {
      var item = {};
      item.content = 'add'
      item.userNo = this.$route.query.userNo
      item.groupCode = this.$route.query.groupCode
      console.log(item);
      this.$router.push({ path: '/contactEdit', query: item })
    },
    // 删除按钮
    delItem(item) {
      var _this = this;
      Dialog.confirm({
        // title: '标题',
        message: '确定删除联系人 ' + item.name + '？'
      }).then(() => {
        let params = {//接口入参
          "data": item.id
        }
        this.$api.fetch({
          params: params,//参数
          apiUrl: '/myWater/connecterDelete',//接口地址
        }).then(res => {
          Toast.success('删除成功');
          setTimeout(() => {
            this.init()
          }, 1000);
        })
      }).catch(() => {
        return
      });

    },
  }
}
</script>

<style scoped lang="less">
.contacts {
  .row {
    overflow: hidden;
    margin-left: 0%;
  }
  .van-swipe-cell__right .van-button {
    height: 100%;
    width: 100%;
  }
  .content-padded {
    margin: 0;
  }
  .item-icon {
    position: absolute;
    left: 50%;
    top: 5%;
  }
  .col-100 {
    margin-left: 2%;
    .list {
      margin: 0;
      .list-title {
        padding: 0;
      }
    }
    /*font-size: 14px;*/
    /*color: red;*/
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
          li {
            padding: 7px;
            text-align: right;
            a {
              display: inline-block;
              color: #3193f6;
            }
          }
        }
      }
    }
    .kr-body {
      padding: 10px 10px;
      .kr-body-info {
        box-shadow: 1px 1px 5px 1px #888;
        border-radius: 10px;
        .kr-containt {
          .kr-div-parent {
            border: 1px solid #e6e6e6;
            display: flex;
            width: 100%;
            padding: 10px 10px;
            height: 120px;
            display: -webkit-inline-box;
            .kr-left {
              width: 95%;
              .kr-parent {
                // font-weight: bolder;
                span {
                  font-size: 15px;
                }
              }
              .kr-phone {
                padding: 5px 20px;
                // font-weight: 600;
                font-size: 16px;
                span {
                  // font-weight: bolder;
                  // color: #5fa9ff;
                }
              }
            }
            .kr-right {
              width: 5%;
              padding: 30px 0;
              .icon {
                display: inline-block;
                color: #bdbdbd;
                font-size: 22px;
                transform: rotate(180deg);
              }
            }
          }
        }
      }
      .no-people {
        padding: 3% 3%;
        text-align: center;
        color: #aaa;
      }
      .kr-button {
        padding: 10px;
        // font-family: PingFang_Medium;
      }
    }
  }
}
</style>