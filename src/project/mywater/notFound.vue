 <template>
  <div class="water-query">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>未绑定用户</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :isShow="isShow" :title='title'></myHeader> -->
        <headerThree :message='message'></headerThree>
        <!-- <div class="row add_box">
          <div class="col-100">
            <div class="midle-bar">
              <b></b>
              <router-link :to="{ path: 'accountBind' }">
                <img src="../../../static/img/plus.png" alt="">
              </router-link>
            </div>
          </div>
        </div> -->

        <div class="kr-body">
          <div class="kr-containt">
            <div class="kr-top">
              <img src="../../../static/img/youzhi.png" alt="">
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

        <div class="row bottom_box" @click="goWaterConcerns" v-if="WaterConcernsShow">

          <van-divider dashed :style="{ color: 'gray', borderColor: 'gray', fontSize: '18px' }">{{waterConcernsData.length > 0?'我关注的地区':'我还没有关注地区'}}</van-divider>
          <div class="bottom_explain" v-if="waterConcernsData.length == 0">
            关注地区后可接收停水通知或其它重要公告信息
          </div>
          <div class="bottom_item" v-for="item in waterConcernsData" :key="item.groupCode">
            {{item.groupArea}}
          </div>
          <div class="bottom_more">
            <img src="../../../static/img/starblue.png" alt="" style="vertical-align: -1px;">
            {{waterConcernsData.length > 0?'关注更多地区':'立即关注'}}
          </div>
        </div>

      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      message: {
        title: "请绑定用户",
        span1: "尊敬的" + (localStorage.getItem('nickname') === null ? 'XX' : localStorage.getItem('nickname')),
        span2: "请绑定您的用户",
        isShow: '',
      },
      isShow: 1,
      title: "请绑定用户",
      // title:'粤海水务',

      // 地区关注数据
      waterConcernsData: [],
      // 显示和隐藏加号按钮与未绑定水表样式
      contentShow: true,
      // 控制关注地区的显示
      WaterConcernsShow: false,
    }
  },
  mounted() {
    this.WaterConcernsShow = false
    this.getWaterConcernsData()
    // 水费查缴页面需要多一个（为其他户号缴费）
    if (window.location.href.indexOf('moreUser') > -1) {
      this.message.isShow = 1
    }
  },
  methods: {
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
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
.water-query {
  .content-padded {
    height: 100%;
    margin: 0;
    .kr-body {
      padding: 10% 5%;
      height: 53%;
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
    .add_box {
      position: absolute;
      width: 100%;
      top: 26%;
      height: 10%;
      padding: 0px 5px;
    }
  }
  .row {
    margin-left: 0;
  }
  .col-100 {
    .midle-bar {
      padding: 0 0 0 15px;
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
        margin-right: 10px;
        width: 20%;
        .pay-button {
          font-size: 18px;
          background: blue;
          height: 100%;
          width: 100%;
        }
      }
      .item-content {
        .item-title {
          height: 1.6rem;
          line-height: 1.6rem;
          img {
            position: relative;
            top: 0.2rem;
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
}
</style>