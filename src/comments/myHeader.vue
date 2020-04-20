<template>
  <div class="row img_content">
    <div class="myheader">
      <img :src="rabbit" alt="" />
      <h4>{{user}}</h4>
    </div>
    <div class="headerlink">
      <!-- <router-link :to="{ path: 'fastpay' }" v-if="isShow == 1"> -->
      <a @click="goWay(1)" v-if="isShow == 1">
        <span style="color: white;font-size: 14px">为其他户号缴费</span>
      </a>
      <!-- </router-link> -->
      <!-- <router-link :to="{ path: 'accountBind' }" v-if="isShow == 2"> -->
      <a @click="goWay(2)" v-if="isShow == 2">
        <span style="color: white;font-size: 14px">前往绑定用户
        </span>
      </a>
      <!-- </router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["isShow", 'title'],
  data() {
    return {
      user: localStorage.getItem('nickname'),
      rabbit: localStorage.getItem("headImgUrl"),
    }
  },
  // filters: {
  //   dealUser: function (value) {
  //     if (value.length > 10)
  //       return value.slice(0, 10) + '...'
  //     else
  //       return value
  //   }
  // },
  mounted() {
    console.log(this.title,$('#myTitle').html(this.title));
    $('#myTitle').html(this.title)
  },
  methods: {
    goFastPay() {
      this.$router.push({ path: '/fastpay' })
    },
    goAccBind() {
      this.$router.push({ path: '/accountBind' })
    },
    goWay(num){
      if(num == 1){
        // localStorage.setItem('moreUser','2')
        // sessionStorage.setItem('moreUser','2')
        this.$router.push({ path: '/fastpay' })
      }else if(num == 2){
        this.$router.push({ path: '/accountBind' })
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.img_content {
  display: flex;
  // height: 9rem;
  height: 30%;
  width: 100%;
  background: url("../../static/img/juxingtu(h).png") no-repeat;
  background-size: 100% 100%;
  margin-left: 0;
  .col-100 {
    margin-left: 0;
    .user-title {
      text-align: center;
      padding: 10% 0;
      color: #fff;
      // font-family: PingFang_Medium;
    }
    .user-card {
      // padding: 5% 0 0 0 !important;
      padding: 0% 0 0 0 !important;
      border-radius: 10px;
      padding: 5px 0 20px 5px;
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
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        // border-bottom: 1px solid #2c1212a1;
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 0 0 0 0.75rem;
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
          width: 30%;
          img {
            width: 90%;
            border-radius: 50%;
            overflow: hidden;
            /*width: 50%;*/
          }
        }
        .right-content {
          margin-left: 0.75rem;
          width: 100%;
          position: relative;
          // padding: 0.4rem 0.75rem 0.4rem 0;
          padding: 8% 0 0 0;
          h4,
          p {
            // font-family: PingFang_Medium;
            font-size: 22px;
            color: #fff;
            // margin: 20px 0;
          }
          h4 {
            a {
              color: #3193f6;
              float: right;
              font-size: 15px;
              line-height: 27px;
              font-weight: 500;
              padding-right: 15px;
              background: url("../../static/img/kuaisu.png") no-repeat;
              background-position: right;
              background-size: 14px;
              border-bottom: 1px solid white;
            }
          }
          p {
            font-size: 16px;
            span {
              padding-left: 20px;
              background: url("../../static/img/coin.png") no-repeat;
              background-position: left bottom;
              background-size: 14px;
            }
          }
        }
      }
    }
  }
  .myheader {
    width: 100%;
    height: 100%;
    // text-align: right;
    // display: -webkit-box;
    // display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    // -webkit-box-align: center;
    // -ms-flex-align: center;
    align-items: center;
    // align-items:flex-end;
    // -webkit-box-pack: center;
    // -ms-flex-pack: center;
    justify-content: center;
    img {
      border-radius: 50%;
      width: 20%;
    }
    h4 {
      color: #fff;
      font-size: 32px;
      // padding:0 5%;
    }
  }
  .headerlink {
    width: 98%;
    position: fixed;
    top: 10%;
    bottom: 0;
    left: 0;
    right: 3%;
    height: 5%;
    margin-right: 3%;
    a {
      color: #3193f6;
      float: right;
      font-size: 15px;
      line-height: 27px;
      font-weight: 500;
      padding-right: 15px;
      background: url("../../static/img/kuaisu.png") no-repeat;
      background-position: right;
      background-size: 14px;
      border-bottom: 1px solid white;
    }
  }
}
</style>