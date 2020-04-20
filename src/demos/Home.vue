<template>
  <div class="my-page">
    <page-header>
      <header-title>微信公众号</header-title>
    </page-header>
    <page-content>
      <header class='demos-header'>
        <h1 class="demos-title">我的用水</h1>
      </header>
      <div class="grids grids-small">
        <router-link :to="{ path: 'home' }" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/page.png" alt="">
          </div>
          <p class="grid_label">
            vum界面
          </p>
        </router-link>
        <!-- <router-link :to="{ path: 'notFound' }" class="grid"> -->
        <a class="grid" @click="waterPrice">
          <div class="grid_icon">
            <img src="../assets/images/home/button.png" alt="">
          </div>
          <p class="grid_label">
            水费查缴
          </p>
        </a>
        <!-- </router-link> -->
        <a @click="goEleinvoices" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/column.png" alt="">
          </div>
          <p class="grid_label">
            电子发票
          </p>
        </a>
        <!-- <router-link :to="{ path: 'businesshand' }" class="grid"> -->
        <a @click="goAway(-1)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/grid.png" alt="">
          </div>
          <p class="grid_label">
            业务办理
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: '/personalcenter' }" class="grid"> -->
        <a @click="goAway(0)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/list.png" alt="">
          </div>
          <p class="grid_label">
            个人中心
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: '/bill' }" class="grid"> -->
        <!-- <a class="grid" @click="waterPrice">
          <div class="grid_icon">
            <img src="../assets/images/home/contacts.png" alt="">
          </div>
          <p class="grid_label">
            账单
          </p>
        </a> -->
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: '/selfHelpMeterReading' }" class="grid"> -->
        <a @click="goAway(1)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/contacts.png" alt="">
          </div>
          <p class="grid_label">
            自助抄表
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: '/shareMeterReading' }" class="grid"> -->
        <a @click="goAway(2)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/contacts.png" alt="">
          </div>
          <p class="grid_label">
            共享抄表
          </p>
        </a>
        <!-- </router-link> -->

      </div>
      <header class='demos-header'>
        <h1 class="demos-title">公共服务</h1>
      </header>
      <div class="grids grids-small">
        <!-- <router-link :to="{ path: '/salesNetwork' }" class="grid"> -->
        <a @click="goAway(3)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/page.png" alt="">
          </div>
          <p class="grid_label">
            营业网点
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: 'waterPriceInfo' }" class="grid"> -->
        <a @click="goAway(4)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/button.png" alt="">
          </div>
          <p class="grid_label">
            水价信息
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: 'qualityReport' }" class="grid"> -->
        <a @click="goAway(5)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/column.png" alt="">
          </div>
          <p class="grid_label">
            水质报告
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: 'announcemen' }" class="grid"> -->
        <a @click="goAway(6)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/grid.png" alt="">
          </div>
          <p class="grid_label">
            通知公告
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: '/gdhInfo' }" class="grid"> -->
        <a @click="goAway(7)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/list.png" alt="">
          </div>
          <p class="grid_label">
            粤海资讯
          </p>
        </a>
        <!-- </router-link> -->
      </div>
      <h2 class="demos-title">更多精彩</h2>
      <div class="grids grids-small">
        <a @click="goComplaintreport" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/modal.png" alt="">
          </div>
          <p class="grid_label">
            投诉举报
          </p>
        </a>
        <a @click="goLeakandrepairs" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/preloader.png" alt="">
          </div>
          <p class="grid_label">
            报修/报漏
          </p>
        </a>
        <!-- <router-link :to="{ path: 'intelservice' }" class="grid"> -->
        <a @click="goAway(8)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/toast.png" alt="">
          </div>
          <p class="grid_label">
            智慧客服
          </p>
        </a>
        <!-- </router-link> -->
        <!-- <router-link :to="{ path: 'thePipe' }" class="grid"> -->
        <a @click="goAway(9)" class="grid">
          <div class="grid_icon">
            <img src="../assets/images/home/tab.png" alt="">
          </div>
          <p class="grid_label">
            水管家
          </p>
        </a>
        <!-- </router-link> -->

      </div>
    </page-content>
  </div>
</template>
<script>
//import'../components/grid'
//import { Header, HeaderLink, HeaderTitle } from '../components/header'
//import Content from '../components/content'

export default {
  data() {
    return {

    }
  },
  mounted() {
    // localStorage.setItem('token', '1')
    // this.test()// 后端重定向微信用户信息接口
  },
  methods: {
    // 投诉举报
    goComplaintreport(){
      this.$router.push({ path: '/complaintreport' })
    },
    // 报修报漏
    goLeakandrepairs(){
      // 从首页进去，不跳至我的报修报漏-我的历史页面
      localStorage.setItem('leakandrepairsHistory', false)
      this.$router.push({ path: '/leakandrepairs' })
    },
    goEleinvoices() {
      // localStorage.setItem('isBack', false)
      this.$router.push({ path: 'multiHousehold' })
    },
    // waterPrice() {
    //   let that = this;
    //   let params = {
    //     "data": {
    //       "openId": localStorage.getItem('openId'),
    //     },
    //   }
    //   that.$api.fetch({
    //     params,//参数
    //     apiUrl: '/myWater/bindCtmList',//接口地址
    //   }).then(res => {
    //     if (res.length > 1) {// 多户页面
    //       that.$router.push({ path: '/moreUser' })
    //     } else if (res.length == 1) {// 单户页面
    //       localStorage.setItem('userNo', res[0].ctmNo);
    //       localStorage.setItem('groupOpenId', res[0].groupOpenId);
    //       localStorage.setItem('groupCode', res[0].groupCode);
    //       if(parseFloat(res[0].meterCount) >1 ){
    //         localStorage.setItem('accNo', res[0].accountNo);
    //         that.$router.push({ path: '/moreAccount' })
    //       }else if(parseFloat(res[0].meterCount) ==1){
    //         that.$router.push({ path: '/bill' })
    //       }
    //     } else if (res.length == 0) {// 未绑定页面
    //       that.$router.push({ path: '/notFound' })
    //     }
    //   })
    // },
    waterPrice() {
      // localStorage.setItem('name','0');
      // http://192.168.13.140:8086//?token=5dd4a40e2cc90b532cf2fc74#/peopleApply?isModify=2
      // console.log(window.location.href.substring(0, window.location.href.indexOf('#')));
      // if (window.location.href.substring(0, window.location.href.indexOf('#')).indexOf('?') > 0) {
      //   window.location.href = window.location.href.substring(0, window.location.href.indexOf('#')) + '#/moreUser'
      // }else{
      //   window.location.href = window.location.href.substring(0, window.location.href.indexOf('#')) + '?token='+localStorage.getItem('token')+'#/moreUser'
      // }
      this.$router.push({ path: '/moreUser' })

    },
    goAway(i){
      if(i == -1){
        //业务办理
        this.$router.push({ path: '/businesshand' })
      }else if(i==0){
        //个人中心
        this.$router.push({ path: '/personalcenter' })
      }else if(i==1){
        //自助抄表
        this.$router.push({ path: '/meterReadingAccount' })
      }else if(i==2){
        //共享抄表
        this.$router.push({ path: '/shareMeterReading' })
      }else if(i==3){
        //营业网点
        this.$router.push({ path: '/salesNetwork' })
      }else if(i==4){
        //水价信息
        this.$router.push({ path: '/waterPriceInfo' })
      }else if(i==5){
        //水质报告
        this.$router.push({ path: '/qualityReport' })
      }else if(i==6){
        //通知公告
        this.$router.push({ path: '/announcemen' })
      }else if(i==7){
        //粤海资讯
        this.$router.push({ path: '/gdhInfo' })
      }else if(i==8){
        //智慧客服
        this.$router.push({ path: '/intelservice' })
      }else if(i==9){
        //水管家
        this.$router.push({ path: '/thePipe' })
      }
    }
  }
}
</script>
