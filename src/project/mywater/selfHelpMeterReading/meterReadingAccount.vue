 <template>
  <div class="meterReadingAccount" v-if="multiHouseholdShow && !eleinvoicesShow && !notFoundShow">
    <page-content>
      <div class="content-padded">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!-- <myHeader :isShow="isShow" :title="title"></myHeader> -->
          <headerThree :message='message'></headerThree>
          <div class="row bottom_content" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
              <van-cell v-for="item in tableData" :key="item.groupCode"> -->
            <div @click="goSelfHelpMeterReading(item)" class="mra-father" v-for="item in tableData" :key="item.groupCode">
              <div class="mra-left">
                <img src="../../../../static/img/chaobiao(ggg).png">
              </div>
              <div class="mra-middle">
                <div class="item-title">
                  <span class="user_address">
                    所属地区：{{item.groupArea}}</span>
                </div>
                <div class="item-title">
                  <span class="user_address">
                    用户编号：{{item.userNo}}</span>
                </div>
                <div class="item-title">
                  <span class="user_address">
                    用户地址：{{item.userAddress}}</span>
                </div>
              </div>
              <div class="mra-right">
                <a>
                  <icon icon="link"></icon>
                </a>
              </div>
            </div>
            <!-- </van-cell>
            </van-list> -->
          </div>
        </van-pull-refresh>
      </div>
    </page-content>
  </div>
  <eleinvoices v-else-if="!multiHouseholdShow && eleinvoicesShow && !notFoundShow"></eleinvoices>
  <notFound v-else-if="!multiHouseholdShow && !eleinvoicesShow && notFoundShow"></notFound>
</template>

<script>
import { PullRefresh } from 'vant';
import common from '@/comments/common'
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import eleinvoices from './index'
import notFound from '../notFound'
export default {
  components: {
    myHeader, headerThree,
    eleinvoices,
    notFound,
    common
  },
  data() {
    return {
      message: {
        title: "自助抄表",
        span1: "不想抄表员上门打扰？",
        span2: "自助抄表，畅享自由用水生活！",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      multiHouseholdShow: true,
      eleinvoicesShow: false,
      notFoundShow: false,
      title: '自助抄表',
      isShow: 0,
      tableData: [],

      needData: [],
    }
  },
  filters: {

  },
  mounted() {
    this.$store.state.notFound = 5;
    // eventBus.$on('text', (data) => {
    //   console.log(data);
    //   this.tableData = data
    //   console.log(this.tableData);
    // })
    // this.getUserNum()
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
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.tableData.length) {
          this.finished = true;
        }

      }, 500);
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
        if (res.userCount > 1) {// 多户页面
          _this.multiHouseholdShow = true
          _this.eleinvoicesShow = false
          _this.notFoundShow = false
          this.init()
        } else if (res.userCount == 1) {// 单户页面
          _this.multiHouseholdShow = false
          _this.eleinvoicesShow = true
          _this.notFoundShow = false
          // this.$router.push({ path: 'eleinvoices' })
        } else if (res.userCount == 0) {// 未绑定页面
          // this.$router.push({ path: 'notFound' })
          _this.multiHouseholdShow = false
          _this.eleinvoicesShow = false
          _this.notFoundShow = true
        }
      })
    },
    // 获取列表数据
    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId')
        },
        // "data": 'ok6sbwaaL5BexHwyWbdCu4I9ddOE',
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/selfUserList',//接口地址
      }).then(res => {

        if (res.length > 1) {// 多户页面
          _this.multiHouseholdShow = true
          _this.eleinvoicesShow = false
          _this.notFoundShow = false

          _this.tableData = res;
        } else if (res.length == 1) {// 单户页面
          _this.multiHouseholdShow = false
          _this.eleinvoicesShow = true
          _this.notFoundShow = false

          _this.$store.state.meterReadingAccount = res;
        } else if (res.length == 0) {// 未绑定页面
          _this.multiHouseholdShow = false
          _this.eleinvoicesShow = false
          _this.notFoundShow = true
        }
      })
    },
    goSelfHelpMeterReading(item) {
      console.log(item);
      this.$router.push({ path: '/selfHelpMeterReading', query: item })
    },

  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.meterReadingAccount {
  .no_more {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    color: #969799;
    font-size: 14px;
  }
  .add_box {
    position: absolute;
    width: 100%;
    top: 26.5%;
    height: 7%;
  }
  .bottom_content {
    // height: 70%;
    // overflow-y: auto;
    padding: 3% 0;
    .mra-father {
      // padding: 2% 0%;
      margin-top: 2%;
      margin-bottom: 2%;
      margin-left: 2%;
      margin-right: 2%;
      box-shadow: 1px 1px 5px 1px #888;
      width: 96%;
      border-radius: 10px;
      height: 25%;
      display: flex;
      .mra-left {
        border-radius: 10px 0px 0px 10px;
        background:#ebf3ff;
        width: 24%;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          // width: 60%;
          height: 60%;
          width: 70%;
        }
      }
      .mra-middle {
        padding:2% 3%;
        font-size: 15px;
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .item-title {
          height: 1.5rem;
          line-height: 1.5rem;
          font-weight: 300;
          img {
            position: relative;
            top: 0.2rem;
          }
          .user_address {
            // font-family: PingFang_Medium;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 100%;
          }
        }
      }
      .mra-right {
        width: 6%;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 40%;
        }
      }
    }
    .list {
      margin: 0;
      // margin: 0.8rem 0.5rem 1rem 0;
      box-shadow: 1px 1px 5px 1px #888888;
    }
    .col-100 {
      width: 94%;
    }
    .button {
      background-color: white;
      color: #b6b6b6;
      font-size: 1rem;
    }
    .van-list {
      // height: 100%;
    }
  }

  .content-padded {
    margin: 0;
    // height: 100%;
  }
  .row {
    margin-left: 0%;
  }
  .col-100 {
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
    .list {
      .item-media {
        // margin-right: 10px;
        // width: 20%;
        width: 10%;
        padding: 0;
        .pay-button {
          font-size: 18px;
          background: blue;
          // height: 100%;
          width: 100%;
        }
      }
      .item-img {
        width: 15%;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 40%;
        }
      }
      .item-content {
        padding: 0.4rem 0 0.4rem 0;
        // width: 77%;
        width: 75%;
        .item-title {
          height: 1.2rem;
          line-height: 1.2rem;
          // font-family: PingFang_Regular;
          font-weight: 300;
          img {
            position: relative;
            top: 0.2rem;
          }
          .user_address {
            // font-family: PingFang_Medium;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
