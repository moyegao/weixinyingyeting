
<template>
  <div class="quality-report">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>水质报告详情</header-title>
    </page-header> -->
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="content-padded">
          <div class="row kr-img" style="padding: 10px;">
            <!-- <img class="bottom_img" :src="reportDetail.url" alt=""> -->
            <iframe :src="reportDetail.url" style="height:100%; width:100%; frameborder=no" frameborder="no" border="0" marginWidth=0 marginHeight=0>
            </iframe>
          </div>
        </div>
      <!-- </van-pull-refresh> -->
    </page-content>
  </div>
</template>

<script>
import { PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader,headerThree
  },
  data() {
    return {
      message:{
        title:"水质报告详情",
        span1:"足不出户",
        span2:"在家看水质报告详情",
        isShow: '',
      },
      title:'水质报告详情',
      //上拉刷新
      isLoading: false,
      scrollTop:0,//滚动条隔顶部的距离
      
      Img: require('../../../static/img/jiancebaogao.jpg'),
      fastpay: require('../../../static/img/banner-pic.png'),
      comp: require('@/project/assets/images/form/i-form-name.png'),
      notePic: require('@/project/assets/images/home/modal.png'),
      reportData: [],
      reportDetail: [],
    }
  },
  mounted() {
    this.reportData = this.$route.query;
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
        this.reportData = this.$route.query;
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
        apiUrl: '/public/waterQualityQuery',//接口地址
      }).then(res => {
        _this.reportDetail = res
        let div = _this.reportDetail.content
      })
    },

  }
}
</script>

<style scoped lang="less">
.quality-report {
  .bottom_img {
    height: 19.5rem;
    margin-left: 4%;
  }
  .content-padded {
    margin: 0;
    height: 70%;
    overflow-y: auto;
    .kr-img {
      height: 100%;
      margin-left: 0 !important;
    }
    .list {
      margin: 0;
    }
    .fr-img {
    }
  }
}
</style>