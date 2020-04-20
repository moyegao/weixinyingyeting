<template>
  <div class="leakandrepairsDetail" v-if="leakandrepairsShow">
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <!-- <myHeader :title="title"></myHeader> -->
      <headerThree :message='message'></headerThree>
      <div class="span_content">
        <van-field class="yh-my-blue" v-model="repairData.groupName" readonly left-icon="location-o" label="所属水司" size="large" />
        <van-field class="yh-my-red add-pic" readonly label="发生地点" left-icon="wap-home-o" size="large" />
        <van-cell-group>
          <van-field v-model="repairData.leakAddress" rows="1" autosize type="textarea" readonly />
        </van-cell-group>
        <van-field class="yh-my-blue" v-model="repairData.faultEquipmentType" label="故障设备" readonly left-icon="award-o" size="large" />
        <van-field class="yh-my-red add-pic" readonly label="备注信息" left-icon="comment-o" size="large" />
        <van-cell-group class="beizhu">
          <van-field v-model="repairData.repairRemark" rows="1" autosize type="textarea" readonly />
        </van-cell-group>
        <!-- <van-field class="yh-my-red add-pic" readonly label="照片" left-icon="photo-o" size="large" /> -->
        <div class="yh-my-uploader">
          <van-image width="30%" v-for="item in repairFileList" :key="item.url" fit="contain" :src="item.url" />
        </div>
        <van-field class="yh-my-blue" v-model="repairData.contact" readonly left-icon="manager-o" label="联系人" size="large" />
        <van-field class="yh-my-red" v-model="repairData.phone" readonly left-icon="phone-o" label="手机号码" size="large" />
      </div>
      <!-- </van-pull-refresh> -->
    </page-content>
  </div>
  <historyUpload v-else :upLoadNeedData="upLoadNeedData"></historyUpload>
</template>

<script>
import { PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import historyUpload from '../moresurprise/historyUpload'
import axios from 'axios'
export default {
  components: {
    myHeader, headerThree,
    historyUpload
  },
  data() {
    return {
      message: {
        title: "报修/报漏",
        // span1: "工单单号：" + this.$route.query.id,
        span1:'',
        span2: "处理时间：" + this.$route.query.repairOrLeakDate,
        span3: "处理状态：" + this.$route.query.status,
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: '报修/报漏',
      tabIndex: 0,
      index: '',
      repairShow: false,
      //报修数据
      repairData: {
        groupCode: "",
        userNo: '',
      },
      // 报漏数据
      leakData: {
        repairOrLeakDate: '',
      },

      leakandrepairsShow: true,
      upLoadNeedData: {
        fileList: [],
      },
      groupFullName: '',
      repairFileList: [],
      leakFileList: [],
    }
  },
  mounted() {
    this.init()
    // this.BUS.$on('closeUpload', (item) => {
    //   this.leakandrepairsShow = true
    //   if (item == 'repair') {
    //     this.tabIndex = 0
    //   }else if (item == 'leak') {
    //     this.tabIndex = 1
    //   }
    // })
    localStorage.setItem('leakandrepairsHistory', true)
    if (this.$route.query.repairOrLeak == 1) {
      this.repairShow = true
    } else if (this.$route.query.repairOrLeak == 2) {
      this.repairShow = false
    }
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
        localStorage.setItem('leakandrepairsHistory', true)
        if (this.$route.query.repairOrLeak == 1) {
          this.repairShow = true
        } else if (this.$route.query.repairOrLeak == 2) {
          this.repairShow = false
        }
      }, 500);
    },
    init() {
      console.log(this.$route.query);
      var _this = this;
      let params = {//接口入参
        "data": {
          // "groupCode": this.$route.query.groupCode,
          // "id": this.$route.query.id,
          "groupCode": this.$route.query.groupCode,
          "busiId": this.$route.query.id,
          "busiType": 2,
          "source": '',
        },
      }
      if (_this.$route.query.source == 1) {
        params.data.source = 1
      } else {
        params.data.source = 2
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiQuery',//接口地址
      }).then(res => {
        _this.repairFileList = []
        _this.leakFileList = []
        _this.repairData = res
        if (res.picture !== null) {
          for (let i = 0; i < res.picture.length; i++) {
            _this.repairFileList.push({ url: res.picture[i] })
          }
        }
        // if (_this.$route.query.repairOrLeak == 1) {
        //   _this.repairData = res
        //   if (res.picture !== null) {
        //     for (let i = 0; i < res.picture.length; i++) {
        //       _this.repairFileList.push({ url: res.picture[i] })
        //     }
        //   }

        // } else if (_this.$route.query.repairOrLeak == 2) {
        //   _this.leakData = res
        //   if (res.picture !== null) {
        //     for (let i = 0; i < res.picture.length; i++) {
        //       _this.leakFileList.push({ url: res.picture[i] })
        //     }
        //   }
        // }

      })
    },

  }
}
</script>

<style scoped lang="less">
.leakandrepairsDetail {
  .yh-my-uploader {
    padding: 10px 2%;
    border-bottom: 1px solid #eee;
  }
  .van-cell-group {
    border-bottom: 1px solid #eee;
  }
  .beizhu {
    border-bottom: none;
  }
  .span_content {
    padding: 2% 2%;
    .van-cell--large {
      border-bottom: 1px solid #eee;
    }
    .van-cell--large {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .add-pic {
      border: 0 !important;
      font-size: 16px;
      color: #323233;
    }
    .van-radio-group {
      width: 100%;
      display: flex;
      padding: 1% 1%;
      .van-radio {
        width: 100%;
      }
    }
  }
  .buttons-tab {
    display: none;
  }
  .tab-container {
    padding: 0 10px;
    .buttons-tab {
      box-shadow: 1px 1px 5px 1px #888;
    }
    .tabs {
      .tab .col-100 {
        width: 99%;
        margin-left: 2%;
      }
    }
  }
  .bottom_content {
    margin: 0px 0px 0px 0px;
    .col-100 {
      margin-left: 2%;
    }
    .list {
      margin: 0.5rem 0.5rem 1rem 0;
      box-shadow: 1px 1px 10px 1px #888888;
      ul {
        padding: 10px 10px 0 0;
      }
      .item-content {
        padding: 0 0 0 0;
      }
      li {
        border-bottom: 0;
      }
      .item-inner {
        padding: 10px 0 0 0 !important;
      }
    }
    // .list .item-inner {
    // 	padding: 10px 0 0 0;
    // }
    .col-100 {
      width: 98%;
    }
    .button {
      background-color: white;
      color: #b6b6b6;
      font-size: 1.3rem;
    }
  }
  .item-title-row {
    margin-bottom: 1%;
  }
  .first_content {
    display: inline-block;
    width: 45%;
    border-bottom: #dcdcdc solid 1px;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #989898;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
      // color: #000000;
    }
  }
  .list li + li .item-content:before {
    background-color: white;
  }
  .second_content {
    display: inline-block;
    width: 35%;
    border-bottom: #dcdcdc solid 1px;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #adadad;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
      // color: #000000;
    }
  }
  .second_content:first-child {
    width: 25%;
  }
  .Third_content {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid #dcdcdc;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #888888;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
  }
  .kr-complain {
    margin: 10px;
    padding: 10px 20px;
    font-size: 15px;
    box-shadow: 1px 1px 5px 1px #888;
    .kr-div {
      display: flex;
      width: 100%;
      div {
        width: 47%;
        span {
          font-size: 12px;
          // font-family: PingFang_Bold;
          font-weight: 600;
          color: #989898;
        }
        input {
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
        }
      }
      .kr-div-last {
        margin-left: 5%;
      }
    }
    .kr-div-third {
      display: flex;
      width: 100%;
      div {
        width: 30%;
        span {
          font-size: 12px;
          // font-family: PingFang_Bold;
          font-weight: 600;
          color: #989898;
        }
        input {
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
        }
      }
      .kr-div-last {
        margin-left: 5%;
      }
    }
    .kr-title {
      span {
        font-size: 12px;
        font-weight: 600;
        color: #989898;
      }
      p {
        font-size: 12px;
        // font-family: PingFang_Bold;
        font-weight: 600;
        color: #989898;
      }
      input,
      textarea,
      .van-field__control {
        // font-family: PingFang_Medium;
        color: #000;
        border: 0;
        width: 100%;
        // border-bottom: 1px solid #eee;
      }
      .van-cell {
        padding: 0;
      }
    }
  }
  .add_box {
    position: absolute;
    width: 20%;
    right: 4%;
    height: 8%;
    // z-index: 9999;
    .midle-bar {
      float: right;
    }
  }
  .add_box1 {
    top: 61.5%;
  }
  .add_box2 {
    top: 66.5%;
  }
  .list {
    margin: 0;
    .list-title {
      padding: 0;
    }
  }
  .form-list .item-content img {
    position: absolute;
    top: 0.2rem;
    left: 50%;
  }
  .yh-content {
    box-shadow: 1px 1px 5px 1px #888;
    margin-top: 10px;
    .yh-parent {
      padding: 10px 12px;
      font-size: 15px;
      // font-family: PingFang_Regular;
      font-weight: 300;
      border-bottom: 1px solid #989898;
      .yh-top,
      .yh-middle,
      .yh-bottom {
        padding: 6px 0;
      }
      .yh-middle {
        // font-family: PingFang_Bold;
        font-weight: 600;
      }
    }
  }
  .box {
    width: 100px;
    height: 100px;
    background-color: #ed702d;
    color: #fff;
    /* Rotate div */
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); /* Internet Explorer */
    -moz-transform: rotate(45deg); /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg); /* Opera */

    position: absolute;
    right: -50px;
    top: -50px;
    .text {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>