<template>
  <!-- v-if="!notFoundShow" -->
  <div class="announcemen">
    <page-content>
      <div class="content-padded">
        <div class="kr-body">
          <div class="kr-containt">
            <div class="search_box">
              <div class="address_content">
                <van-field class="address" label="所属地区" v-model="groupName" readonly @click="showAddressChuang" left-icon="location-o" right-icon="arrow" placeholder="请选择地区" />
              </div>
            </div>
            <div class="kr-search_div" @touchmove="touchmove($event)" @scroll="scroll($event)">
              <div class="kr-div-parent">
                <div style="width:100%" class="yh-content">
                  <div class="yh-tongzhi yh-top no-kongge">
                    <div class="yh-father yh-top-title">
                      <div class="yh-slot"></div>
                      <span class="yh-left yh-title">停水通知</span>
                      <span class="yh-right yh-readmore" style="z-index:9999" @click="readMore(0)" v-if="stopTotal > 2">更多>></span>
                      <span class="yh-right yh-readmore" v-if="stopTotal <= 2"></span>
                    </div>
                    <div v-if="stopData.length !== 0">
                      <div class="yh-father" v-for="(item,i) in stopData" :key='i' @click="details(item)">
                        <div class="yh-left">
                          <div class="yh-left-top">
                            <span class="yh-left-title">{{item.title}}</span>
                          </div>
                          <div class="yh-left-bottom">
                            <div class="yh-bottom-div">
                              <img src="../../../static/img/shijian.png" alt="">
                              <span>{{item.time}}</span>
                            </div>
                          </div>
                        </div>
                        <div class="yh-right">
                          <img :src="item.icon" alt="">
                        </div>
                      </div>
                    </div>
                    <div v-if="stopData.length == 0" class="yh-no-info">
                      暂无停水通知
                    </div>
                  </div>
                  <div class="yh-tongzhi yh-middle">
                    <div class="yh-father yh-top-title">
                      <div class="yh-slot"></div>
                      <span class="yh-left yh-title">公告</span>
                      <span class="yh-right yh-readmore" @click="readMore(1)" v-if="noteTotal > 2">更多>></span>
                      <span class="yh-right yh-readmore" v-if="noteTotal <= 2"></span>
                    </div>
                    <div v-if="noteData.length !== 0">
                      <div class="yh-father" v-for="(item,i) in noteData" :key='i' @click="details(item)">
                        <div class="yh-left">
                          <div class="yh-left-top">
                            <span class="yh-left-title">{{item.title}}</span>
                          </div>
                          <div class="yh-left-bottom">
                            <div class="yh-bottom-div">
                              <img src="../../../static/img/shijian.png" alt="">
                              <span>{{item.time}}</span>
                            </div>
                          </div>
                        </div>
                        <div class="yh-right">
                          <img :src="item.icon" alt="">
                        </div>
                      </div>
                    </div>

                    <div v-if="noteData.length == 0" class="yh-no-info">
                      暂无公告
                    </div>
                  </div>
                  <div class="yh-tongzhi yh-bottom">
                    <div class="yh-father yh-top-title">
                      <div class="yh-slot"></div>
                      <span class="yh-left yh-title">新闻</span>
                      <span class="yh-right yh-readmore" @click="readMore(2)" v-if="newTotal >2">更多>></span>
                      <span class="yh-right yh-readmore" v-if="newTotal <= 2"></span>
                    </div>
                    <div v-if="newData.length !== 0">
                      <div class="yh-father" v-for="(item,i) in newData" :key='i' @click="details(item)">
                        <div class="yh-left">
                          <div class="yh-left-top">
                            <span class="yh-left-title">{{item.title}}</span>
                          </div>
                          <div class="yh-left-bottom">
                            <div class="yh-bottom-div">
                              <img src="../../../static/img/shijian.png" alt="">
                              <span>{{item.time}}</span>
                            </div>
                          </div>
                        </div>
                        <div class="yh-right">
                          <img :src="item.icon" alt="">
                        </div>
                      </div>
                    </div>

                    <div v-if="newData.length == 0" class="yh-no-info">
                      暂无新闻
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-content>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" />
    </van-popup>
  </div>
</template>

<script>

import { PullRefresh } from 'vant';
import myHeader from "@/comments/myHeader";
import headerThree from '@/comments/headerThree';
import notFound from '../mywater/notFound'
export default {
  components: {
    myHeader, headerThree, notFound
  },
  data() {
    return {
      // notFound:false,
      newAreaMap:{},
      newCityMap:{},
      message: {
        title: "通知公告",
        span1: "足不出户",
        span2: "在家看公告",
        isShow: '',
      },
      title: '通知公告',
      stopTotal: 0,//停水通知返回数据总数
      newTotal: 0,//新闻返回数据总数
      noteTotal: 0,//公告数据总数
      // notFoundShow: false,
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      comp: require("@/project/assets/images/form/i-form-name.png"),
      noteData: [],//公告数据
      newData: [],//新闻咨询
      stopData: [],//停水通知
      companyData: [],
      first_sel: null,
      groupCode: null,
      userbindCompany: [],

      nullTip: "空空如也~",
      pageSize: 20, // 每页条数
      pageIndex: 1, // 页码
      isDownLoading: false, // 下拉刷新
      isUpLoading: false, // 上拉加载
      upFinished: false, // 上拉加载完毕
      offset: 100, // 滚动条与底部距离小于 offset 时触发load事件
      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      userlist: {},
      groupName: "",
    };
  },
  mounted() {
    console.log(this.areaList);
    // this.$store.state.notFound = 1;
    $('#myTitle').html(this.title)
    // this.queryCompanyMes();
    this.getArrList2()
    // this.$nextTick(() => {
    //   window.scrollTo(0, localStorage.getItem('scrollTop'))
    //   // document.body.scrollTo(0, localStorage.getItem('scrollTop'))
    // });
    // this.scrollToTop(localStorage.getItem('scrollTop'))
    // $(window).scrollTop(300);

    // if (this.notFound == true) {
    //   this.notFoundShow = true
    // }
  },
  methods: {
    scrollToTop(num) {
      var element = document.documentElement.scrollTop ? document.documentElement : document.body;
      element.scrollTop = num;
    },
    scroll(e) {
      if ((parseInt(e.target.clientHeight) + Math.ceil(e.target.scrollTop)) === parseInt(e.target.scrollHeight)) {
        console.log("到底")
      } else if (e.target.scrollTop == 0) {
        console.log("到顶")
        e.stopPropagation()
      }
      localStorage.setItem('scrollTop', e.target.scrollTop)
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
      // this.groupCode = this.common.codeTrans(this.groupCode,this.newAreaMap)
      this.groupCode = this.common.codeTransCity(this.groupCode,this.newCityMap);
      this.groupName = this.groupName.replace('*', '')
      keyName = this.groupName;
      sessionStorage.setItem('keyCode', keyCode)
      sessionStorage.setItem('groupKeyCode', this.groupCode)
      sessionStorage.setItem('groupKeyName', this.groupName)
      this.relationShow = false
      //查询通告列表
      this.first_sel = this.groupCode;
      this.noteData = [];
      this.pageIndex = 1; // 页码
      this.upFinished = false; // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.queryNote(this.groupCode);
      this.getNewList()
      this.getStopList()
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
        },
      }
      _this.$api.fetch({
        params, //参数
        apiUrl: '/common/wAreaTree', //接口地址
      }).then(res => {
        _this.newAreaMap = res.areaMap;
        _this.newCityMap = res.cityMap;
        _this.areaList.province_list = res.provinceMap; //省
        // _this.areaList.city_list = res.cityMap; //市
        // _this.areaList.county_list = res.areaMap; //区
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        console.log(_this.areaList);
        console.log(_this.first_sel);
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

        //新增
        _this.userbindCompany = res.bwcList;
        if (bindData[0]) {
          _this.first_sel = bindData[0].groupCode;
          console.log(_this.first_sel);
          _this.groupName = bindData[0].groupName;
          for (const key in _this.areaList.county_list) {//区
            let groupCode = key.slice(4)
            if (_this.first_sel == groupCode) {
              _this.areaNum = key;
            } else {
              for (const item in _this.areaList.city_list) {//市
                let code = item.slice(2)
                if (_this.first_sel == code) {
                  _this.areaNum = item;
                }
              }
            }
          }
          _this.groupCode = _this.first_sel;
          _this.queryNote(_this.first_sel);
          _this.getNewList()
          _this.getStopList()
        } else {
          //默认获取第一个
          // _this.first_sel = _this.areaList.county_list;
          _this.first_sel = sessionStorage.getItem('groupKeyCode');
          _this.groupCode = sessionStorage.getItem('groupKeyCode')
          _this.getNewList()
          _this.getStopList()
          _this.queryNote(sessionStorage.getItem('groupKeyCode'));
          _this.groupName = sessionStorage.getItem('groupKeyName');
          _this.areaNum = sessionStorage.getItem('keyCode');
        }

        if (bindData.length > 0) {
          _this.first_sel = bindData[0].groupCode;

          // _this.groupCode = bindData[0].groupCode
          _this.groupName = bindData[0].groupName
          // _this.queryNote(_this.groupCode)
        } else {
          _this.getGeolocation()
        }
        // _this.getUserNum(_this.first_sel)
        console.log(_this.first_sel);
      })
    },
    // 获取用户绑定数据
    getUserNum(groupCode) {
      let _this = this
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          groupCode: groupCode,
        }
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/selfUserList',//接口地址
      }).then(res => {
        console.log(res)
        if(res.length == 0){
          _this.notFoundShow = true;
        }else{
          _this.notFoundShow = false;
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
        _this.queryNote(_this.groupCode)
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

    // 上拉加载请求方法
    onLoadList() {
      this.pageIndex++;
      this.queryNote(this.first_sel);
    },
    // 获取用户信息
    queryCompanyMes() {
      let _this = this;
      let params = {
        //接口入参
        data: {
          groupCode: _this.groupCode
        }
      };
      this.$api
        .fetch({
          params: params, //参数
          apiUrl: "/public/companyList" //接口地址
        })
        .then(res => {
          _this.companyData = res;

          //用户绑定的水司
          _this.userbindCompany = [{
            groupCode: "1",
            groupName: "梧州水司"
          },
          {
            groupCode: "3",
            groupName: "南沙水司"
          },
          {
            groupCode: "2",
            groupName: "肇庆水司"
          }
          ];
          //设定默认值
          if (_this.userbindCompany[0]) {
            _this.first_sel = _this.userbindCompany[0].groupCode;
          } else {
            _this.first_sel = _this.companyData[0].groupCode;
          }
          _this.queryNote(_this.first_sel);
        });
    },
    // 获取通知公告列表
    queryNote(groupCode) {
      var _this = this;
      let params = {
        //接口入参
        data: {
          page: 1,
          pageCount: 3,
          groupCode: _this.first_sel,
          type: 2,
        }
      };
      this.$api
        .fetch({
          params: params, //参数
          apiUrl: "/public/noticeList" //接口地址
        })
        .then(res => {
          const rows = res.list;
          _this.noteData = res.list;
          _this.noteTotal = res.total;
          if (rows == null || rows.length === 0) {
            // 加载结束
            _this.upFinished = true;
            return;
          }
          // 最后一页不足10条的情况
          if (rows.length < this.pageSize) {
            _this.upFinished = true;
          }
          // 处理数据
          if (_this.pageIndex === 1) {
            _this.noteData = rows;
          } else {
            _this.noteData = _this.noteData.concat(rows);
          }

        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "获取资源列表异常{" + error + "}",
            type: "error"
          });
          console.log(error.code)
          if (error.code == 10019) {
            _this.noteData = [];
            _this.noteTotal = 0;
          }
        })
        .finally(() => {
          _this.isDownLoading = false;
          _this.isUpLoading = false;
        });
    },
    choice_company(value) {
      this.noteData = [];
      this.pageIndex = 1; // 页码
      this.upFinished = false; // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.queryNote(this.first_sel);
    },
    details(item) {
      item.groupCode = this.first_sel;
      this.getInfoDetail(item);
      // this.$router.push({
      //   path: "/infoDetail",
      //   query: item
      // });
    },
    getInfoDetail(item) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": this.groupCode,
          "id": item.id
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/public/noticeQuery',//接口地址
      }).then(res => {
        let key = {};
        key.res = res
        key.id = item.id
        key.groupCode = _this.groupCode;
        key.title = _this.message.title;
        if (res.url !== null) {
          window.location.href = res.url;
        } else {
          this.$router.push({
            path: "/infoDetail",
            query: key
          });
        }
      })
    },
    getNewList() {
      let that = this;
      let data = {
        // groupCode: that.groupCode,
        groupCode: that.first_sel,
        page: 1,
        pageCount: 3,
        type: 3,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/public/noticeList',//接口地址
      }).then(res => {
        that.newData = res.list;
        that.newTotal = res.total;
      }).catch(error=>{
        that.newData = [];
        that.newTotal = 0;
      })
    },
    getStopList() {
      let that = this;
      let data = {
        // groupCode: that.groupCode,
        groupCode: that.first_sel,
        page: 1,
        pageCount: 3,
        type: 1,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/public/noticeList',//接口地址
      }).then(res => {
        that.stopData = res.list;
        that.stopTotal = res.total;
      }).catch(error=>{
        that.stopData = [];
        that.stopTotal = 0;
      })
    },
    readMore(num) {
      let query = {};
      query.groupCode = this.first_sel;
      if (num == 0) {//停水通知
        query.path = '/public/noticeList';
        query.title = '0';
        query.type = 1;
      } else if (num == 1) {//公告
        query.path = '/public/noticeList';
        query.title = '1'
        query.type = 2;
      } else if (num == 2) {//新闻
        query.path = '/public/noticeList';
        query.title = '2'
        query.type = 3;
      }
      this.$router.push({ path: '/moreAnnouncemen', query })
    },
  }
};

</script>

<style scoped lang="less">
.announcemen {
  height: 100%;
  .search_box {
    width: 100%;
    // height: 5%;
    background: #3649b3;
    .address_content {
      .address {
        background: #3649b3;
        border: none;
        height: 3rem;
        padding: 5% 1%;
        .van-field__control {
          color: white;
        }
      }
    }
  }
  .page-content {
    height: 100%;

    .content-padded {
      height: 100%;

      .kr-body {
        height: 100%;

        .kr-containt {
          height: 100%;

          .search_content {
            height: 10%;
            line-height: 1;
            border-bottom: 1px solid #f0f0f0;
            .van-cell--large {
              border-bottom: 1px solid #f0f0f0;
            }
            .koron_search {
              .van-field__control {
                text-align: center;
              }
            }

            .search_sel {
              height: 100%;
              width: 60%;
            }
          }
          .kr-search_div {
            height: 90%;
            background: #f0f0f0;
            overflow-y: auto;
            .van-cell {
              // border-bottom: 1px solid #f0f0f0;
            }
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
      // padding: 2% 3%;

      .kr-containt {
        // margin-top:18px;
        box-shadow: 0px 1px 9px -1px #888;

        .kr-div-parent {
          // border: 1px solid #e6e6e6;
          border-bottom: 0;
          display: flex;
          width: 100%;
          // padding: 0% 3%;

          .yh-content {
            .yh-tongzhi {
              margin-top: 3%;
              padding: 0 3%;
              background: #fff;
              .yh-father {
                height: 4.8rem;
                padding: 2% 1%;
                display: flex;
                justify-content: space-between;
                width: 100%;
                border-bottom: 1px solid #f0f0f0;
                align-items: center;
                span {
                  font-size: 1rem;
                  // display: inline-block;
                  // overflow: hidden;
                  // white-space: nowrap;
                  // text-overflow: ellipsis;
                }
                .yh-left {
                  width: 75%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  .yh-left-top {
                    .yh-left-zd {
                      padding: 1% 1%;
                      font-size: 0.6rem;
                      border: 1px solid #729dae;
                      color: #729dae;
                    }
                    .yh-left-title {
                      font-size: 0.7rem;
                    }
                  }
                  .yh-left-bottom {
                    .yh-bottom-div {
                      display: inline-block;
                      span {
                        font-size: 0.6rem;
                        color: #7d7d7d;
                      }
                      img {
                        width: 15%;
                      }
                      .img-yj {
                        width: 30%;
                      }
                    }
                  }
                }
                .yh-right {
                  width: 25%;
                  text-align: right;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  img {
                    // width: 100%;
                    width: 60%;
                  }
                }
                .yh-title {
                  margin-left: 0.5rem;
                  border: 0;
                  font-size: 0.8rem;
                  font-weight: bold;
                  // color:#1f55ad;
                }
                .yh-readmore {
                  font-size: 0.6rem;
                  color: #b7b7b7;
                  display: inline-block;
                  text-align: right;
                }
                .yh-slot {
                  display: inline-block;
                  width: 4px;
                  height: 1rem;
                  background: #3f9ebe;
                }
              }
              .yh-top-title {
                height: auto;
              }
              .yh-no-info {
                font-size: 0.8rem;
                padding: 2% 1%;
                display: flex;
                justify-content: space-between;
                width: 100%;
                border-bottom: 1px solid #f0f0f0;
                align-items: center;
              }
            }
            .no-kongge {
              margin-top: 0%;
            }
            .yh-top {
              border-radius: 0 0 5px 5px;
            }
            .yh-middle {
              border-radius: 2%;
            }
            .yh-bottom {
              border-radius: 5px 5px 0 0;
            }
          }

          .van-cell {
          }
          .cp-father {
            padding: 2% 1%;
            margin-top: 1.5%;
            margin-bottom: 1.5%;
            margin-left: 2%;
            margin-right: 2%;
            box-shadow: 1px 1px 5px 1px #888;
            width: 96%;
            border-radius: 10px;
            display: flex;
          }
          .van-cell__value {
            display: flex;

            .kr-xiaoxi {
              width: 15%;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              img {
                width: 60%;
              }
            }

            .kr-left {
              width: 80%;

              span {
                color: #bdbdbd;
                font-family: PingFang_Medium;
                font-size: 13px;
                padding: 0 0 3% 0;
              }

              .kr-title {
                font-family: PingFang_Bold;
                font-size: 16px;
                color: #141414;
              }

              .kr-date {
                display: inline-block;
                float: right;
                margin-left: 10px;
                margin-right: 10px;
              }

              p {
                font-family: PingFang_Regular;
                font-size: 14px;
                padding: 3% 0 0 0;
                width: 100%;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }

            .kr-right {
              width: 5%;
              // padding: 15px 0;
              display: flex;
              flex-direction: column;
              justify-content: center;

              .icon {
                display: inline-block;
                color: #e6e6e6;
                font-size: 15px;
                transform: rotate(180deg);
              }
            }
          }
        }
        .no-div {
          color: #999;
          height: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .list {
      margin: 0;
    }
  }
}
</style>
