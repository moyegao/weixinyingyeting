<template>
  <div class="service">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link><icon icon="back"></icon>返回</header-link>
      <header-title>客服服务</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="yh-body">
          <div class="yh-conent">
            <!-- goChild('salesNetwork') goYywd() -->
            <!-- <a :href="hrefUrl" class="yh-div01">
              <img src="../../../../static/img/yywd(f).png" alt="">
            </a>
            <a :href="hrefUrl" class="yh-div02">
              <div class="yh-title">营业网点</div>
              <div class="yh-remark">快速寻找及定位附近的营业网点</div>
            </a> -->
            <div @click="goChild('salesNetwork')" class="yh-div01">
              <img src="../../../../static/img/yywd(f).png" alt="">
            </div>
            <div @click="goChild('salesNetwork')" class="yh-div02">
              <div class="yh-title">营业网点</div>
              <div class="yh-remark">寻找附近的营业网点</div>
            </div>
          </div>
          <div class="yh-conent">
            <div @click="goProgressQuery()" class="yh-div01">
              <img src="../../../../static/img/kefu(e).png" alt="">
            </div>
            <div @click="goProgressQuery()" class="yh-div02">
              <div class="yh-title">客服热线</div>
              <div class="yh-remark">联系客服寻求帮助</div>
            </div>
          </div>
          <div class="yh-conent">
            <div @click="goChild('complaintreport')" class="yh-div01">
              <img src="../../../../static/img/tousu(d).png" alt="">
            </div>
            <div @click="goChild('complaintreport')" class="yh-div02">
              <div class="yh-title">投诉建议</div>
              <div class="yh-remark">填写信息及进度查询</div>
            </div>
          </div>
        </div>
      </div>
    </page-content>
    <van-overlay :show="show" @click="close(0,$event)">
      <!-- ="show = false" -->
      <div class="wrapper">
        <div class="block" @click.stop="close(1,$event)">
          <div class="kr-zhezhao-img">
            <img src="../../../../static/img/kefu.png" alt="">
          </div>
          <div class="kr-zhezhao-content">
            <div class="kr-zhezhao-title">联系客服</div>
            <div class="kr-zhezhao-aaa">我们将会全心全意为您提供满意周到的咨询服务，也希望您能支持和监督我们的服务!</div>
            <div class="kr-zhezhao-bbb">
              <a :href='"tel:"+tel'>拨打客服热线（<span>{{tel}}</span>）</a>
            </div>
            <div class="kr-zhezhao-ccc" @click="close(2,$event)">取消</div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader,headerThree
  },
  data() {
    return {
      message:{
        title:"客服服务",
        span1:"您的满意，是我们的追求",
        span2:"我们将竭诚为您提供最优质的服务",
        isShow: '',
      },
      title: '客服服务',
      show: false,
      tel: "952525",
      hrefUrl: '',
    }
  },
  mounted() {
    if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
      // location.href = 'localhost:8081/mob/#' + this.$route.path
      // this.hrefUrl = window.location.href.split('#')[0] + '#/salesNetwork'
      this.hrefUrl = location.href.split('/#')[0] + '/#/salesNetwork'
    }else{
      // this.hrefUrl = window.location.href.split('#')[0] + '#/salesNetwork'
      this.hrefUrl = location.href.split('#')[0] + '#/salesNetwork'
    }
  },
  methods: {
    goChild(path) {
      var _this = this
      if (path == 'salesNetwork') {
        _this.common.moduleAccess('8', _this, function () {})
      }else if (path == 'complaintreport') {
        _this.common.moduleAccess('10', _this, function () {})
      }
      this.$router.push({ path, })
    },
    goProgressQuery() {
      var _this = this
      // this.$router.push({ path: '/serviceTel' })
      _this.common.moduleAccess('9', _this, function () {})
      this.show = true;
    },
    close(num, e) {
      console.log(num);
      e.stopPropagation;
      if (num == 0 || num == 2) {
        this.show = false;
      }
    }
  },
  //解决 VUE 微信 IOS 路由跳转问题
  watch: {
    "$route"() {
      if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
        location.href = 'localhost:8081/mob/#' + this.$route.path
      }
    },
  },
}
</script>

<style scoped lang="less">
.service {
  .grids:before {
    border: none;
  }
  .content-padded {
    margin: 0 !important;
    height:100%;
  }
  .col-100 {
    .grid-demo {
      .grids {
        .grid {
          width: 30%;
          margin-left: 2.5%;
          margin-top: 3%;
          margin-bottom: 3%;
          box-shadow: 1px 1px 5px 1px #888888;
          padding: 10px;
          .grid_label {
            font-weight: 600;
            font-size: 12px;
          }
        }
      }
    }
  }
  .yh-body {
    height: 70%;
    padding: 5% 8%;
    .yh-conent {
      height: 20%;
      width: 100%;
      display: flex;
      flex-direction: row;
      box-shadow: 1px 1px 5px 1px #888888;
      margin-top: 5%;
      border-radius: 5px;
      .yh-div01 {
        width: 25%;
        background: #ebf3ff;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 35%;
          color: #fff;
        }
      }
      .yh-div02 {
        width: 75%;
        line-height: 100%;
        height: 100%;
        padding: 2% 0% 2% 8%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .yh-title {
          font-weight: bolder;
          font-size: 16px;
          color: #3d4145;
        }
        .yh-remark {
          font-size: 16px;
          font-weight: 100;
          color: #3d4145;
        }
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 90%;
    height: auto;
    background-color: #fff;
    .kr-zhezhao-img {
      background: #01d2df;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 80%;
      }
    }
    .kr-zhezhao-content {
      height: auto;
      padding: 1% 3%;
      text-align: center;
      span {
        display: inline-block;
        a {
          display: inline-block;
        }
      }
      .kr-zhezhao-title {
        padding: 3% 0 0 0;
        font-weight: bolder;
        color: #000;
        font-size: 1rem;
      }
      .kr-zhezhao-aaa {
        padding: 3% 0;
        text-align: center;
        color: #989898;
        font-size: 0.75rem;
      }
      .kr-zhezhao-bbb {
        width: 90%;
        margin-left: 5%;
        padding: 3% 0%;
        background: #49cc7b;
        a {
          color: #fff;
          font-size: 0.8rem;
        }
      }
      .kr-zhezhao-ccc {
        color: #49cc7b;
        padding: 3% 0;
        font-size: 0.8rem;
      }
    }
  }
}
</style>