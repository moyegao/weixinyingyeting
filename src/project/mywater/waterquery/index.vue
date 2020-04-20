 <template>
  <div class="water-query">
    <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>水费查缴</header-title>
    </page-header>
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :isShow="isShow"></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="row bottom_content">
          <div class="col-100">
            <list>
              <list-item :link="false">
                <div class="item-content">
                  <div class="item-title-row">
                    <div class="item-title">
                      <img src="../../../../static/img/yonghubianhao.png" width="20" style="margin-right: 15px;">
                      用户编号：100100000000
                    </div>
                  </div>
                  <div class="item-title">
                    <img src="../../../../static/img/yonghudizhi.png" width="20" style="margin-right: 15px;">
                    用户地址：<span class="user_address">步埠路39号</span>
                  </div>
                </div>
                <div class="item-media">
                  <router-link :to="{ path: 'bill' }">
                    <m-button size="small" :round="true">

                      <icon icon="link"></icon>
                    </m-button>
                  </router-link>
                </div>
              </list-item>
              <list-item :link="false">
                <div class="item-content">
                  <div class="item-title-row">
                    <div class="item-title">
                      <img src="../../../../static/img/yonghubianhao.png" width="20" style="margin-right: 15px;">
                      用户编号：100100000000
                    </div>
                  </div>
                  <div class="item-title">
                    <img src="../../../../static/img/yonghudizhi.png" width="20" style="margin-right: 15px;">
                    用户地址：<span class="user_address">步埠路39号</span>
                  </div>
                </div>
                <div class="item-media">
                  <router-link :to="{ path: 'bill' }">
                    <m-button size="small" :round="true">

                      <icon icon="link"></icon>
                    </m-button>
                  </router-link>
                </div>
              </list-item>
              <list-item :link="false">
                <div class="item-content">
                  <div class="item-title-row">
                    <div class="item-title">
                      <img src="../../../../static/img/yonghubianhao.png" width="20" style="margin-right: 15px;">
                      用户编号：100100000000
                    </div>
                  </div>
                  <div class="item-title">
                    <img src="../../../../static/img/yonghudizhi.png" width="20" style="margin-right: 15px;">
                    用户地址：<span class="user_address">步埠路39号</span>
                  </div>
                </div>
                <div class="item-media">
                  <router-link :to="{ path: 'bill' }">
                    <m-button size="small" :round="true">

                      <icon icon="link"></icon>
                    </m-button>
                  </router-link>
                </div>
              </list-item>
            </list>
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
  components:{
    myHeader,headerThree
  },
  data() {
    return {
      isShow:1,
    }
  },
  filters: {

  },
  mounted() {

  },
  methods: {

  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.water-query {
  .add_box {
    position: absolute;
    width: 100%;
    top: 26.5%;
    height: 7%;
  }
  .bottom_content {
    margin: 10px 0px 10px 0px;
    .list {
      margin: 1rem 0.5rem 1rem 0;
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
  }

  .content-padded {
    margin: 0;
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
        padding: 0.2rem 0.75rem 0.2rem 0;
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
          }
        }
      }
    }
  }
}
</style>
