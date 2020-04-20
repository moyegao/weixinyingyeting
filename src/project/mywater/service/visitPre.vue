<template>
  <div class="visit-pre">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>参观预约</header-title>
    </page-header> -->
    <page-content>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content-padded">
          <!-- <myHeader :title="title"></myHeader> -->
          <!-- <headerThree :message = 'message'></headerThree> -->
          <!-- <div class="search_box">
            <div class="address_content">
              <van-field class="address" label="所属地区" v-model="groupName" readonly @click="showAddressChuang" left-icon="location-o" right-icon="arrow" placeholder="请选择地区" />
            </div>
          </div> -->
          <div class="kr-body" @touchmove="touchmove($event)" @scroll="scroll($event)">

            <div class="kr-div-parent">
              <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
                <van-cell class="kr-containt" v-for="item in tableData" :key="item.busiId + item.userNo" @click="goDetail(item)"> -->
              <div class="yh-bottom" v-if="needData.length ==0">
                <div class="yh-title">暂无参观预约活动</div>
              </div>
              <div v-if="needData.length !== 0">
                <div class="kr-containt" v-for="(item,i) in needData" :key='i' @click="goWay(item)">
                  <div class="yh-left">
                    <div class="yh-left-top">
                      <span class="yh-left-title">{{item.name}}</span>
                    </div>
                    <div class="yh-left-middle">&nbsp;&nbsp;&nbsp;&nbsp;
                      <span class="yh-left-title">{{item.content}}</span>
                    </div>
                    <div class="yh-left-bottom">
                      <div class="yh-bottom-div">
                        <img src="../../../../static/img/shijian.png" alt="">
                        <span>{{item.time}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="yh-right">
                    <img :src="item.icon" alt="">
                  </div>
                </div>
              </div>

              <!-- </van-cell>
              </van-list> -->
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </page-content>
    <!-- 水司下拉数据 -->
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
        title: "参观预约活动",
        span1: "参与参观活动",
        span2: "共同监督与见证水司的建设",
        isShow: '',
      },
      title: '参观预约活动',

      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      groupCode: null,
      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {
      },
      userlist: {},
      groupName: "",
      userbindCompany: {},
      needData: [],
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
    $('#myTitle').html('参观预约')
    this.getArrList();
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
    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      let keyCode = '';
      let keyName = '';
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        keyCode = val[1].code;
        this.groupCode = val[1].code.slice(2)
        this.groupName = val[0].name + val[1].name
      } else {
        keyCode = val[2].code;
        this.groupCode = val[2].code.slice(4);
        this.groupName = val[0].name + val[1].name + val[2].name
      }
      this.groupCode = this.common.codeTransCity(this.groupCode,this.newCityMap);
      // this.groupCode = this.common.codeTrans(this.groupCode,this.newAreaMap)
      this.groupName = this.groupName.replace('*', '')
      keyName = this.groupName;
      this.getNeedData(this.groupCode)
      this.relationShow = false
    },
    // 三级联动点击取消按钮事件
    exit() {
      this.relationShow = false
    },
    // 三级联动状态改变事件
    onChange() { },
    getArrList() {
      let _this = this
      let params = {
        "data": {
          openId: localStorage.getItem('openId'),
          hasWxHall: 1
        },
      }
      _this.$api.fetch({
        params, //参数
        apiUrl: '/common/wAreaTree', //接口地址
      }).then(res => {
        _this.areaList.province_list = res.provinceMap; //省
        // _this.areaList.city_list = res.cityMap; //市
        // _this.areaList.county_list = res.areaMap; //区
        _this.newAreaMap = res.areaMap;
        _this.newCityMap = res.cityMap;
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市

        _this.userbindCompany = JSON.parse(localStorage.getItem('bwcList'))
        //设定默认值
        if (_this.userbindCompany[0] && sessionStorage.getItem('groupKeyCode') == null) {
          let codeNum = _this.userbindCompany[0].groupCode
          _this.groupName = _this.userbindCompany[0].groupName;
          for (const key in _this.areaList.county_list) {//区
            let groupCode = key.slice(4)
            if (codeNum == groupCode) {
              _this.areaNum = key;
            } else {
              for (const item in _this.areaList.city_list) {//市
                let code = item.slice(2)
                if (codeNum == code) {
                  _this.areaNum = item;
                }
              }
            }
          }
          _this.getNeedData(codeNum)
        } else {
          //默认获取第一个
          _this.groupCode = sessionStorage.getItem('groupKeyCode')
          _this.groupName = sessionStorage.getItem('groupKeyName');
          _this.areaNum = sessionStorage.getItem('keyCode');
          _this.getNeedData(_this.groupCode)
        }
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
          _this.groupCode = bindData[0].groupCode
          _this.groupName = bindData[0].groupName
          _this.getNeedData(_this.groupCode)
        } else {
          _this.getGeolocation1()
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
        _this.groupCode = res.groupCode
        _this.groupName = res.groupArea
        _this.getNeedData(_this.groupCode)
      })
    },
    // 获取当前位置经纬度
    getGeolocation1() {
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
    getNeedData(groupCode) {
      let _this = this
      let params = {
        "data": {
          groupCode,
        },
      }
      _this.$api.fetch({
        params, //参数
        apiUrl: '/moreFun/activityList', //接口地址
      }).then(res => {
        _this.needData = res
      })
    },
    goWay(item) {
      console.log(item.url);
      // alert(item.url)
      // window.open(item.url);
      // window.location.href = item.url;
      location.href = item.url;
      // 不兼容安卓,增加时间或随机数
      // window.location.href= item.url + '?timestamp=' + ((new Date()).getTime()+Math.random());
    },
  }
}
</script>

<style scoped lang="less">
.visit-pre {
  .van-cell--large {
    border-bottom: 1px solid #666;
  }
  .van-search {
    padding: 5px 12px;
    margin: 0 10px;
    border-radius: 3px;
  }
  .van-field__control {
    color: #fff !important;
  }
  .search_box {
    width: 100%;
    height: 3rem;
    background: #3649B3;
    .address_content {
      .address {
        background: #3649B3;
        border: none;
        padding: 5% 1%;
        .van-field__control {
          color: #fff !important;
        }
      }
    }
  }
  .content-padded {
    margin: 0;
    .kr-body {
      height: 90%;
      overflow-y: auto;
      padding: 15px 10px 10px 10px;
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
          margin-bottom: 10px;
          display: flex;
          width: 100%;
          .yh-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 70%;
            .yh-left-top {
              .yh-left-title {
                font-size: 0.8rem;
                font-weight: bold;
              }
            }
            .yh-left-middle {
              .yh-left-title {
                font-size: 0.8rem;
              }
            }
            .yh-left-bottom {
              .yh-bottom-div {
                display: inline-block;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                span {
                  font-size: 0.6rem;
                  color: #7d7d7d;
                  margin-left: 0.5rem;
                }
                img {
                  width: 6%;
                }
                .img-yj {
                  width: 30%;
                }
              }
            }
          }
          .yh-right {
            width: 30%;
            text-align: right;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
            }
          }
          .yh-title {
            margin-left: 0.5rem;
            border: 0;
            font-size: 1rem;
            font-weight: bold;
            // color:#1f55ad;
          }
        }
        .yh-bottom {
          // box-shadow: 1px 1px 5px 1px #888888;
          padding: 15px 10px;
          border-radius: 15px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 55%;
          .yh-title {
            font-size: 0.8rem;
            color: #9f9f9f;
          }
        }
      }
    }
  }
}
</style>