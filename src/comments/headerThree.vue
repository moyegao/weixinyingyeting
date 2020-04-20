<template>
  <div class="row img_content">

    <div class="header_img">
      <img src="../../static/img/header1.png" alt="" />
    </div>
    <div class="header_title">
      {{message.title}}
    </div>
    <div class="header_content">
      <!-- <div class="content_item">
        {{message.span1}}
      </div>
      <div class="content_item">
        {{message.span2}}
      </div>
      <div class="content_item">
        {{message.span3}}
      </div> -->
      <span class="content_item">
        <!-- |dealUser -->
        {{message.span1 | dealUser}}
      </span>
      <span class="content_item">
        {{message.span2 | dealUser}}
      </span>
      <span class="content_item">
        {{message.span3}}
      </span>
    </div>
    <div class="header_link" v-if="message.isShow == 1">
      <b class="link_item" @click="goWay(1)">
        为其他户号缴费
      </b>
    </div>

    <!-- 用水分析警报头部 -->
    <div class="header_floatImg" v-if="message.status == 1">
      <div class="floatImg_content">
        <img src="../../static/img/jingbao.png" alt="">
        <div class="header_warn">
          {{message.warning1}}
        </div>
        <div class="header_warn">
          {{message.warning2}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      user: localStorage.getItem('nickname'),
      rabbit: localStorage.getItem("headImgUrl"),
    }
  },
  filters: {
    dealUser: function (value) {
      let userNo = '';
      if (value.indexOf('(') > -1) {
        userNo = "(" + value.split('(')[1]
        value = value.split('(')[0]
      }else{
        return value
      }
      if (value.length > 10){
        return value.slice(0, 10) + '...' + userNo
      }else{
        return value
      }
       
    }
  },
  mounted() {
    $('#myTitle').html(this.message.title);
  },
  methods: {
    goWay(num) {
      if (num == 1) {
        this.$router.push({ path: '/fastpay' })
      } else if (num == 2) {
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
  position: relative;
  height: 9rem;
  width: 100%;
  background: url("../../static/img/juxingtu(h).png") no-repeat;
  background-size: 100% 100%;
  margin-left: 0;
  padding: 1% 1%;

  .header_img {
    width: 100%;
    height: 27px;
    margin: 2% 0%;
    padding: 0 1%;
    img {
      // width: 30%;
      float:right;
      height: 100%;
    }
  }
  .header_title {
    width: 100%;
    color: white;
    font-size: 25px;
    font-weight: bolder;
    // margin: 5% 7%;
     margin: 3% 7%;
  }
  .header_content {
    width: 100%;
    padding: 0 7%;
    font-size: 16px;
    font-weight: 300;
    .content_item {
      color: white;

      display: block;
      // display:inline-block;
      // white-space: nowrap;
      // width:100%;
      // overflow: hidden!important;
      // text-overflow: ellipsis!important;
    }
  }
  .header_link {
    width: 100%;
    position: absolute;
    top: 40%;
    right: 3%;
    color: white;
    font-weight: 300;
    background: url("../../static/img/kuaisu.png") no-repeat;
    background-position: right;
    background-size: 14px;

    .link_item {
      float: right;
      font-size: 14px;
      padding-right: 4%;
      border-bottom: 1px solid white;
    }
  }
  .header_floatImg {
    width: 100%;
    position: absolute;
    top: 28%;
    text-align: right;
    .floatImg_content {
      width: 30%;
      float: right;
      margin-right: 10%;
      img {
        position: relative;
        top: 50%;
        transform: translatex(-50%); /* 元素往下位移自身高度50%的距离 */
      }
      .header_warn {
        color: red;
        font-size: 14px;
        text-align: center;
      }
    }
  }

}
</style>