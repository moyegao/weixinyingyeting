<template>
  <div class="progress-query">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>进度查询</header-title>
    </page-header> -->
    <page-content>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content-padded">
          <!-- <myHeader :title="title"></myHeader> -->
          <!-- <headerThree :message = 'message' class="my-header"></headerThree> -->
          <div class="search_box">
            <div class="address_content">
              <!-- <input type="text" class="address" placeholder="请选择水司" v-model="userlist.groupName" @click="showAddressChuang" readonly> -->
              <van-field class="address" left-icon="location-o" v-model="userlist.groupName" readonly @click="showAddressChuang" right-icon="arrow-down" placeholder="请选择地区" />
            </div>
            <div class="search_content">
              <!-- 请输入 -->
              <van-search v-model="searchData.number" placeholder="身份证或手机号进行查询" show-action shape="round" @blur="search" @search="search">
                <div slot="action" @click="search"></div>
              </van-search>
              <!-- <van-field class="search" v-model="searchData.number" @blur="search" right-icon="search" placeholder="请输入身份证或手机号进行查询" /> -->
            </div>
          </div>
          <div class="kr-body" @touchmove="touchmove($event)" @scroll="scroll($event)">

            <div class="kr-div-parent">
              <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
                <van-cell class="kr-containt" v-for="item in tableData" :key="item.busiId + item.userNo" @click="goDetail(item)"> -->
              <div class="kr-containt" v-if="tableData.length !== 0" v-for="item in tableData" :key="item.busiId + item.userNo" @click="goDetail(item)">
                <div class="kr-top">
                  <span class="kr-span-left">{{item.busiName}}</span>
                  <span class="kr-span-right">{{item.busiStatus}}</span>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">业主名称</span>
                    <span class="kr-div-right">{{item.ctmName}}</span>
                  </div>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">所属地区</span>
                    <span class="kr-div-right">{{item.groupArea}}</span>
                  </div>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">身份证号</span>
                    <span class="kr-div-right">{{item.ctmIdCard}}</span>
                  </div>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">手机号码</span>
                    <span class="kr-div-right">{{item.operatorPhone}}</span>
                  </div>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">用户编号</span>
                    <span class="kr-div-right">{{item.userNo}}</span>
                  </div>
                </div>
                <div class="kr-middle">
                  <div class="kr-div kr-user">
                    <span class="kr-div-left">申请时间</span>
                    <span class="kr-div-right">{{item.applyDate}}</span>
                  </div>
                </div>
                <!-- <div class="kr-middle" v-if="item.isReCall == 1"> -->
                <div class="kr-middle" v-if="item.isReCall == 1">
                  <div class="kr-div kr-user" style="display: flex">
                    <van-button type="info" class="returnBtn" @click="reCall($event, item)">撤&nbsp;&nbsp;&nbsp;回</van-button>
                  </div>
                </div>

                <!-- <div class="kr-middle">
                      <div class="kr-div kr-user">
                        <span class="kr-div-left">用户编号</span>
                        <span class="kr-div-right">{{item.userNo}}</span>
                      </div>
                      <div class="kr-div kr-time">
                        <span class="kr-div-left">申请时间</span>
                        <span class="kr-div-right">{{item.applyDate}}</span>
                      </div>
                    </div> -->
              </div>
              <div class="nodata" v-if="tableData.length == 0">
                暂无数据
              </div>
              <!-- </van-cell>
              </van-list> -->
            </div>
          </div>
          <!-- <div class="kr-foot" @click="openSearch" v-if="bottomShow">
            <span>
              我的单据不在这里？用身份证或手机号查询试试
            </span>
          </div> -->
        </div>
      </van-pull-refresh>
    </page-content>
    <!-- 水司下拉数据 -->
    <!-- <van-popup position="bottom" :style="{ height: '40%' }" v-model="waterShow">
      <van-picker class="timepicker" show-toolbar title="所属水司" :columns="waterColumns" @cancel="onCancelWater" @confirm="onConfirmWater" />
    </van-popup> -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import { Toast, PullRefresh, Dialog } from 'vant';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      newCityMap:{},
      newAreaMap:{},
      message: {
        title: "进度查询",
        span1: "尊敬的" + (localStorage.getItem('nickname') === null? 'XX':localStorage.getItem('nickname')) + ',以下是您在微厅办理的业务',
        span2: "若您的业务不在微厅办理,请选择地区后通过身份证或手机号进行查询",
        isShow: '',
      },
      title: '进度查询',
      user: "小胖子",
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,


      list: [
        {
          title: '用户编号',
          content: '1001111'
        },
        {
          title: '用户地址',
          content: '步埠路四级39号'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        },
        {
          name: '充值'
        },
        {
          name: '缴费'
        }
      ],
      searchBoxShow: false,
      bottomShow: true,
      tableData: [],
      waterData: [],
      waterColumns: [],
      waterShow: false,
      searchData: {
        number: '',
      },

      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      userlist: {
        groupCode: '',
        groupName: '',
      },
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 3)
        return value.slice(0, 3) + '...'
      else
        return value
    }
  },
  mounted() {
    $('#myTitle').html(this.message.title);
    this.init()
    // this.getWater()
    this.getArrList2()
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
        this.getArrList2()
      }, 500);
    },
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        console.log('1111');
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.tableData.length) {
          this.finished = true;
        }

      }, 500);
    },

    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          busiType: 0
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiListByOpenId',//接口地址
      }).then(res => {
        _this.tableData = res
      })
    },
    // 获取水司数据
    getWater() {
      var _this = this;
      let params = {//接口入参
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/wCompanyList',//接口地址
      }).then(res => {
        _this.waterData = []
        _this.waterData = res
        _this.waterColumns = _this.waterData.map(item => item.groupFullName)
      })

    },
    // 显示水司下拉框
    openWater() {
      this.waterShow = true
    },
    onCancelWater() {
      this.waterShow = false;
    },
    // 水司遮罩层确定按钮
    onConfirmWater(value, index) {
      console.log(value);
      this.searchData.groupFullName = value
      for (let i = 0; i < this.waterData.length; i++) {
        if (value == this.waterData[i].groupFullName) {
          this.searchData.groupCode = this.waterData[i].groupCode
          break;
        }
      }
      this.waterShow = false;
    },
    openSearch() {
      this.searchBoxShow = true;
      this.bottomShow = false;

    },
    search() {
      var _this = this;
      if (this.searchData.number.length == 0) {
        Toast.fail('手机号或身份证不能为空');
        return
      }
      let params = {//接口入参
        "data": {
          "groupCode": this.searchData.groupCode,
          "busiType": 0
        },
      }
      if (this.searchData.number.length == 11) {
        params.data.mobile = this.searchData.number
      } else if (this.searchData.number.length == 18) {
        params.data.idCard = this.searchData.number
      } else {
        Toast.fail('手机号或身份证不完整');
        return
      }

      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiListByCM',//接口地址
      }).then(res => {
        console.log(params);
        if (res.length == 0) {
          Toast.fail('暂无数据');
        }
        this.tableData = res
      })
    },
    goDetail(item) {
      var content = {}
      //是否是草稿状态
      console.log(item.busiStatus);
      // || item.busiStatus == '未受理'
      if (item.busiStatus == '草稿') {
        content.isDraft = true // 草稿状态
      } else {
        content.isDraft = false
      }
      // if(item.busiStatus == '未受理'){
      //   content.isSync = '1'
      // }else{
      //   content.isSync = '0'
      // }
      content.groupCode = item.groupCode
      content.busiId = item.busiId
      content.busiType = item.busiType
      content.source = item.source
      content.isModify = item.isModify
      content.content = item.isModify
      console.log(content);
      if (item.busiType == 0) {
        this.$router.push({ path: '/peopleApply', query: content })
      } else if (item.busiType == 1) {
        this.$router.push({ path: '/compApply', query: content })
      }
    },
    // 撤回
    reCall(e, item) {
      var _this = this;
      e.stopPropagation()//阻止冒泡
      Dialog.confirm({
        title: '是否确认撤回该申请？',
      }).then(() => {
        let params = {//接口入参
          "data": {
            "groupCode": item.groupCode,
            "busiId": item.busiId,
            "busiType": Number(item.busiType),
            "source": item.source,
          },
        }
        this.$api.fetch({
          params: params,//参数
          apiUrl: '/myWater/busiReCall',//接口地址
        }).then(res => {
          Toast.success({
            message: '撤回成功！',
            position: 'middle',
            duration: 2000
          });
          setTimeout(() => {
            _this.init()
          }, 2000);
        })
      }).catch(() => {

      });
    },
    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.searchData.groupCode = val[1].code.slice(2)
        // this.userlist.groupName = val[0].name + val[1].name
        this.userlist.groupName = val[1].name
      } else {
        this.searchData.groupCode = val[2].code.slice(4);
        // this.userlist.groupName = val[0].name + val[1].name + val[2].name
        this.userlist.groupName = val[2].name
      }
      // this.searchData.groupCode = this.common.codeTrans(this.searchData.groupCode,this.newAreaMap)
      this.searchData.groupCode = this.common.codeTransCity(this.searchData.groupCode,this.newCityMap);
      this.userlist.groupName = this.userlist.groupName.replace('*', '')
      console.log(this.searchData.groupCode);
      this.relationShow = false
    },
    // 三级联动点击取消按钮事件
    exit() {
      this.relationShow = false
    },
    // 三级联动状态改变事件
    onChange() { },
    getArrList2() {
      let _this = this
      let params = {
        "data": {
          openId: localStorage.getItem('openId'),
          hasWxHall: 1
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/wAreaTree',//接口地址
      }).then(res => {
        _this.newAreaMap = res.areaMap;
        _this.newCityMap = res.cityMap;
        _this.areaList.province_list = res.provinceMap;//省
        // _this.areaList.city_list = res.cityMap;//市
        // _this.areaList.county_list = res.areaMap;//区
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        _this.getBindData()
      })
    },
    // 获取绑定水司
    getBindData() {
      let _this = this
      let params = {
        "data": {},
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/getUserInfo',//接口地址
      }).then(res => {

        let bindData = res.bwcList
        console.log(bindData);
        if (bindData.length > 0) {
          _this.userlist.groupCode = bindData[0].groupCode
          _this.userlist.groupName = bindData[0].area
          _this.searchData.groupCode = bindData[0].groupCode

          let incode = _this.userlist.groupCode;
          let countylist = _this.areaList.county_list;//区
          let citylist = _this.areaList.city_list;//市
          let areanum = _this.areaNum;
          _this.areaNum = _this.common.companyTree(incode, countylist, citylist, areanum);
        } else {
          _this.getGeolocation()
        }
      })
    },
    // 获取离当前位置最近的水司
    getSpaceNum(longitude, latitude) {
      let _this = this
      let params = {
        "data": {
          'longitude': longitude,
          'latitude': latitude,
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/getShortestComp',//接口地址
      }).then(res => {
        _this.$set(_this.userlist, 'groupCode', res.groupCode)
        _this.$set(_this.userlist, 'groupName', res.city)
        _this.searchData.groupCode = res.groupCode
      })
    },
    // 获取当前位置经纬度
    getGeolocation() {
      let _this = this
      var map = new AMap.Map('container', {
        resizeEnable: true
      });
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition: 'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            _this.getSpaceNum(result.position.lng, result.position.lat)
          } else {
            // _this.onError(result)
          }
        });
      });
    },
  }
}
</script>

<style scoped lang="less">
.progress-query {
  .van-cell--large {
    border-bottom: 1px solid #666;
  }
  .van-search {
    padding: 1px 1px;
    // margin: 0 10px;
    border-radius: 6px;
  }
  .van-field__control {
    color: white;
  }
  .search_box {
    width: 100%;
    // height: 15%;
    height: 3rem;
    // background: #171d8f;
    background: #3649b3;
    padding: 3.4% 0;
    .address_content {
      display: inline-block;
      width: 30%;
      .address {
        background: #3649b3;
        border: none;
        padding: 5px 5px;
        .van-field__control {
          color: white;
        }
        .van-field__right-icon {
          background: #fff;
          padding: 0 8px 0 0;
        }
      }
    }
    .search_content {
      display: inline-block;
      width: 66%;
      background: #577cba;
      border-radius: 7px;
      .van-field__body {
        padding: 0;
      }
      .van-search__action {
        border-left: 1px solid #fff;
      }
      .van-search__action {
        //按钮
        color: #fff;
        // display: none;
      }
      .van-field__control {
        color: #000;
      }
      .van-search {
        background: #273ca0 !important;
      }
      .van-search__content {
        background: #273ca0;
        .van-field__control {
          color: #fff;
        }
      }
    }
    // height: 1.8rem;
    // width: 90%; // 82%
    // display: inline-block;
    // border-radius: 20px;
    // background-color: #479eff;
    // margin-left: 1%;
    // margin-top: 3%;
    // font-size: 15px;
    // img {
    //   height: 18px;
    //   float: right;
    //   margin-right: 6%;
    //   margin-top: 4%;
    // }
    // input {
    //   background-color: #479eff;
    //   color: white;
    //   border: none;
    //   margin-left: 5%;
    //   height: 100%;
    //   width: 80%;
    //   border-radius: 10px;
    //   font-family: PingFang_Bold;
    // }
    // input::-webkit-input-placeholder {
    //   color: white;
    // }
    // input::-moz-input-placeholder {
    //   color: white;
    // }
    // input::-ms-input-placeholder {
    //   color: white;
    // }
  }
  .img_content {
    // height: 30%;
    height: 9rem;
    width: 100%;
    background: url("../../../../../static/img/juxing.png") no-repeat;
    background-size: 100% 100%;
    margin-left: 0;
  }

  .bottom_content {
    margin: 0px 0px 0px 0px;
    padding-bottom: 10px;
    padding-top: 10px;
    .col-100 {
      margin-left: 3%;
    }
    .list {
      margin: 1rem 0.5rem 1rem 0;
      box-shadow: 1px 1px 5px 1px #888888;
      .item-content {
        padding: 0 0 0 0;
      }
    }
    // .item-title {
    //   font-size: 13px;
    //   color: #888888;
    // }
    .col-100 {
      width: 94%;
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
      font-size: 13px;
      color: #989898;
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
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
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
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
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
    }
  }
  .add_box {
    position: absolute;
    width: 20%;
    top: 77.5%;
    right: 6%;
    height: 7%;
    z-index: 9999;
    .midle-bar {
      float: right;
    }
  }
  .content-padded {
    margin: 0;
    .kr-body {
      height: 92%;
      overflow-y: auto;
      padding: 2%;
      .kr-div-parent {
        // box-shadow: 0px 1px 9px -1px #888;
        .van-cell {
          margin-bottom: 10px;
          box-shadow: 0px 1px 9px -1px #888;
          border-radius: 10px;
        }
        .kr-containt {
          // border: 1px solid #e6e6e6;
          box-shadow: 1px 1px 5px 1px #888888;
          padding: 15px 10px;
          border-radius: 15px;
          margin-bottom: 2%;
          .kr-top {
            padding: 0px 10px 0px 0px;
            span {
              // font-family: PingFang_Bold;
              font-weight: 600;
              font-size: 15px;
            }
            .kr-span-left {
              float: left;
            }
            .kr-span-right {
              float: right;
              color: #ef5858;
            }
          }
          .kr-middle {
            display: flex;
            width: 100%;
            padding: 9px 0 0 0;
            .kr-div {
              // width: 50%;
              .kr-div-left {
                line-height: 1;
                color: #aaa;
                // font-family: PingFang_Bold;
                font-weight: 600;
                font-size: 14px;
                float: left;
              }
              .kr-div-right {
                line-height: 1;
                // font-family: PingFang_Medium;
                font-size: 14px;
                margin-right: 5px;
                float: right;
              }
            }
            .kr-user {
              width: 100%;
              .returnBtn {
                flex: 1;
                height: 1.6rem;
                line-height: 1.6rem;
                border-radius: 15px;
              }
            }
            .kr-time {
              width: 45%;
            }
          }
        }
        .nodata {
          color: #888;
          text-align: center;
          font-size: 1rem;
        }
      }
    }
    .kr-foot {
      padding: 10px;
      span {
        display: inline-block;
        padding-bottom: 3px;
        border-bottom: 1px solid #77b5fe;
        // font-family: PingFang_Bold;
        font-weight: 600;
        font-size: 13px;
        color: #77b5fe;
      }
    }
  }
  .col-100 {
    .user-card {
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
          /*color: #fff;*/
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        color: white;
        margin-top: 23%;
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
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
            /*width: 50%;*/
          }
        }
        .right-content {
          margin-left: 0.75rem;
          width: 100%;
          position: relative;
          padding: 0.4rem 0.75rem 0.4rem 0;
          margin-top: 4%;
          h4,
          p {
            margin: 10px 0;
          }
          h4 {
            a {
              color: #3193f6;
              float: right;
              font-size: 15px;
              line-height: 27px;
              font-weight: 500;
              padding-right: 15px;
              background: url("../../../../../static/img/right-arrow.png")
                no-repeat;
              background-position: right;
              background-size: 9px;
              b {
                text-decoration: underline;
              }
            }
          }
          p {
            font-size: 16px;
            span {
              padding-left: 20px;
              background: url("../../../../../static/img/coin.png") no-repeat;
              background-position: left bottom;
              background-size: 14px;
            }
          }
        }
      }
    }
    .list {
      margin: 0;
      .list-title {
        padding: 0;
      }
    }
    .form-list .item-title.label {
      width: 40%;
    }
    .form-list .item-content img {
      position: absolute;
      top: 0.2rem;
      left: 50%;
    }
  }
  .van-field__left-icon {
    display: none;
  }
}
</style>
