<template>
  <div class="complaintreportDetail">
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <!-- <myHeader :title="title"></myHeader> -->
      <headerThree :message='message'></headerThree>
      <div class="span_content">
        <van-field class="yh-my-blue" v-model="tableData.groupName" readonly left-icon="location-o" label="所属地区" size="large" />
        <van-field class="yh-my-red" v-model="tableData.complainType" readonly left-icon="chat-o" label="投诉类型" size="large" />
        
        <van-field class="yh-my-blue add-pic" label="投诉内容" left-icon="comment-o" size="large" readonly />
        <van-cell-group class="beizhu">
          <van-field readonly v-model="tableData.complainContent" rows="1" autosize type="textarea" placeholder="请输入投诉内容" />
        </van-cell-group>
        <!-- <van-field class="yh-my-blue add-pic" label="照片" left-icon="photo-o" size="large" disabled /> -->
        <div class="yh-my-uploader">
          <van-image style="margin-top: 10px;" width="30%" v-for="item in fileList" :key="item.url" fit="contain" :src="item.url" />
        </div>
        <van-field class="yh-my-red" v-model="tableData.complainant" readonly left-icon="manager-o" label="联系人" size="large" />
        <van-field class="yh-my-blue" v-model="tableData.phone" readonly left-icon="phone-o" label="手机号码" size="large" />
      </div>
      <!-- </van-pull-refresh> -->
    </page-content>
  </div>
</template>

<script>
import { PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import axios from 'axios'
export default {
  components: {
    myHeader, headerThree,
  },
  data() {
    return {
      message: {
        title: "投诉建议详情",
        // span1: "工单单号：" + this.$route.query.complainId,
        span1:'',
        span2: "处理时间：" + this.$route.query.complainDate,
        span3: "处理状态：" + this.$route.query.status,
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: '投诉建议详情',
      fileList: [],
      //投诉举报数据
      tableData: {},
    }
  },
  mounted() {
    this.init()
    localStorage.setItem('ComplaintHistory', true)
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
        localStorage.setItem('ComplaintHistory', true)
      }, 500);
    },

    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          // groupCode: _this.$route.query.groupCode,
          // complainId: _this.$route.query.complainId,
          "groupCode": _this.$route.query.groupCode,
          "busiId": _this.$route.query.complainId,
          "busiType": 3,
          "source": '',
        }
      }
      if (_this.$route.query.source == 1) {
        params.data.source = 1
      }else {
        params.data.source = 2
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiQuery',//接口地址
      }).then(res => {
        _this.tableData = res
        _this.fileList = []
        // || res.picture.length > 0
        if (res.picture !== null) {
          for (let i = 0; i < res.picture.length; i++) {
            _this.fileList.push({ url: res.picture[i] })
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.complaintreportDetail {
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
  .van-uploader__upload {
    border: 2px dashed #4da1ff;
  }
  .next {
    float: right;
    margin-right: 1%;
    margin-top: 3%;
    height: 1.6rem;
    line-height: 1.6rem;
  }
  .tab-container {
    padding: 0 10px;
    .buttons-tab {
      box-shadow: 1px 1px 5px 1px #888;
    }
    .tabs {
      margin-top: 10px !important;
      .tab {
        .col-100 {
          width: 98.8%;
          margin-left: 2%;
        }
      }
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
        // width: 47%;
        width: 100%;
        span {
          // font-family: PingFang_Bold;
          font-weight: 600;
          color: #989898;
          font-size: 12px;
        }
        input {
          caret-color: auto;
          display: block;
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
        }
        input:focus {
          outline: 0;
          caret-color: #489eff;
        }
      }
      .kr-not-edit {
        input {
          height: 100%;
          line-height: 100%;
          font-size: 20px;
          // font-family: PingFang_Bold;
          font-weight: 600;
        }
      }
      .kr-div-last {
        margin-left: 5%;
      }
    }
    .kr-title {
      p {
        // font-family: PingFang_Bold;
        font-weight: 600;
        color: #989898;
        font-size: 12px;
      }
      input {
        // font-family: PingFang_Medium;
        color: #000;
        border: 0;
        width: 100%;
        border-bottom: 1px solid #888;
      }
    }
  }
  .yh-content {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 15px;
    box-shadow: 1px 1px 5px 1px #888;
    .yh-top {
      border-bottom: 1px solid #989898;
      padding: 0 0 6px 0;
      span {
        // font-family: PingFang_Medium;
      }
      .yh-spanL {
        float: right;
        color: #489eff;
      }
    }
    .yh-middle {
      padding: 10px 0;
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
    .yh-bottom {
      text-align: right;
      color: #989898;
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
      font-size: 13px;
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
      font-size: 13px;
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
      font-size: 13px;
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
  .add_box {
    position: absolute;
    width: 20%;
    top: 60.5%;
    right: 4%;
    height: 8%;
    // z-index: 9999;
    .midle-bar {
      float: right;
    }
  }
  .header-pic {
    padding: 5px 5px 0 5px;
  }
  .list {
    margin: 0;
    .list-title {
      padding: 0;
    }
  }
  table {
    th {
      background: #51a5e8;
      color: #fff;
      padding: 0.2rem;
    }
    td {
      text-align: center;
      border-bottom: 1px solid #00b4c2;
      padding: 0.2rem;
    }
  }
  .form-list .item-content img {
    position: absolute;
    top: 0.2rem;
    left: 50%;
  }
}
</style>