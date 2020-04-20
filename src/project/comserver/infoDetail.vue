<template>
  <div class="info-detail">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link><icon icon="back"></icon>返回</header-link>
      <header-title>通知详情</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title ="title"></myHeader> -->
        <!-- <headerThree :message='message'></headerThree> -->
        <div class="kr-body">
          <div class="kr-containt">
            <div class="kr-div-parent kr-parent1">
              <div class="kr-left">
                <!-- noteDataDetail.type==1?"停水通知":"其他" -->
                <!-- <span class="kr-title">{{noteDataDetail.type}}</span> -->
                <p style="font-weight: bolder;font-size:1rem;">{{noteDataDetail.title}}</p>
                <span class="kr-date">{{noteDataDetail.time}}</span>
              </div>
            </div>
            <div class="kr-parent3"></div>
            <div class="kr-div-parent kr-parent2" @touchmove="touchmove($event)" @scroll="scroll($event)">
              <div class="kr-left">
                <p class="kr-p">尊敬的各位业主:</p>
                <p class="kr-p " v-html="noteDataDetail.content"></p>
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
import { PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      message: {
        title: "通知详情",
        span1: "足不出户",
        span2: "在家看通知详情",
        isShow: '',
      },
      title: '通知详情',
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      noteData: [],
      noteDataDetail: [],
    }
  },
  mounted() {
    console.log(this.$route.query, this.$route.query.groupCode, this.$route.query.id);
    $('#myTitle').html(this.$route.query.title + '详情')
    // this.noteDataDetail = this.$route.query.res;
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
        this.noteData = this.$route.query;
        this.init()
      }, 500);
    },

    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": this.$route.query.groupCode,
          "id": this.$route.query.id
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/public/noticeQuery',//接口地址
      }).then(res => {
        _this.noteDataDetail = res
        let div = _this.noteDataDetail.content
      })
    },

  }

}
</script>

<style scoped lang="less">
.info-detail {
  height: 100%;
  .page-content {
    height: 100%;
    .content-padded {
      height: 100%;
      .kr-body {
        height: 100%;
        // padding: 2% 2%;
        .kr-containt {
          height: 100%;
          background: #e6e6e6;
          .kr-parent1 {
            height: 14%;
            background: #fff;
            border-radius: 0 0 5px 5px;
            .kr-left {
              p {
                padding: 0;
              }
            }
          }
          .kr-parent2 {
            border-radius: 5px 5px 0 0;
            background: #fff;
            height: 84%;
            overflow-y: auto;
          }
          .kr-parent3 {
            height: 2%;
          }
        }
      }
    }
  }
  .content-padded {
    margin: 0;
    .row {
      margin-left: 0;
    }
    .kr-body {
      .kr-containt {
        // box-shadow: 0px 1px 9px -1px #888;
        .kr-div-parent {
          border: 1px solid #e6e6e6;
          display: flex;
          width: 100%;
          padding: 10px 10px;
          position: relative;
          .kr-left {
            width: 100%;
            span {
              color: #bdbdbd;
              // font-family: PingFang_Medium;
              font-size: 13px;
            }
            .kr-title {
              // font-family: PingFang_Bold;
              font-size: 16px;
              color: #141414;
            }
            .kr-date {
              position: absolute;
              display: inline-block;
              // float: right;
              margin-left: 10px;
              margin-right: 10px;
              bottom: 0;
              right: 0;
            }
            p {
              // font-family: PingFang_Medium;
              font-size: 15px;
              padding: 8px 2px 0px 2px;
            }
            .kr-p {
              font-size: 16px;
            }
          }
        }
      }
    }
    .list {
      margin: 0;
    }
  }
}
</style>