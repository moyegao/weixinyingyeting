<template>
  <div class="sales-network">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>营业网点</header-title>
    </page-header> -->
    <page-content>
      <!-- addrShow = false && relationShow = false -->
      <van-tabs v-model="active" @click="display($event)">
        <van-tab title="列表模式">
          <!-- <div class="col-100">
            <el-amap vid="amapDemo" :center="center" :plugin="plugin" class="amap-demo" :scrollWheel="true">
              <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :key="index"></el-amap-marker>
              <el-amap-text v-for="(text,index) in markers" :visible="text.visible" :text="text.text" :offset="text.offset" :position="text.position" :events="text.events" :key="'info2-'+index"></el-amap-text>
            </el-amap>
          </div> -->
          <van-field right-icon="arrow" left-icon="location" style="margin-bottom: 5px" label="所属地区：" :value="groupName" placeholder="选择地区" readonly @click="showAddressChuang" />
          <div class="tab_box" v-for="item in noteData" :key="item.long_lat" @click="getMapForTable(item)">
            <div class="item_box">
              <div class="tab_name">
                {{item.name}}
              </div>
              <div class="tab_addr">
                <span>
                  <van-icon name="location" color="#7C8EAA" style="font-size:12px" />&nbsp;&nbsp;&nbsp;{{item.distance}}km&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>{{item.address}}</span>
              </div>
              <div class="tab_content">
                服务时间：{{item.businessHour}}
              </div>
              <div class="tab_content">
                联系电话：{{item.telephone}}
              </div>
            </div>

            <!-- <div class="tab_line"></div> -->
          </div>
        </van-tab>

        <van-tab title="地图模式">
          <div class="content-padded" @click="addrShow = false">
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <!-- <myHeader title='营业网点'></myHeader> -->
            <div class="row kr-map">
              <div class="search_box">
                <van-field style="margin-bottom: 5px" right-icon="arrow" left-icon="location" label="所属地区：" :value="groupName" placeholder="选择地区" readonly @click="showAddressChuang" />
                <!-- <div style="display: inline-block;width: 76%">
                  <van-field label="营业网点：" :value="networkName" placeholder="请选择营业网点" readonly @click="showNetWork" />
                </div> -->
                <!-- <van-field class="koron_vant3" value="导航" @click="getMap" readonly right-icon="arrow" /> -->

              </div>
              <div class="col-100">
                <el-amap vid="amapDemo" :center="center" :plugin="plugin" class="amap-demo" :scrollWheel="true">
                  <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :key="index"></el-amap-marker>
                  <el-amap-text v-for="(text,index) in markers" :visible="text.visible" :text="text.text" :offset="text.offset" :position="text.position" :events="text.events" :key="'info2-'+index"></el-amap-text>
                  <!-- <el-amap-info-window v-if="window" :position="window.position" autoMove=true :visible="window.visible" :content="window.content"></el-amap-info-window> -->
                </el-amap>
              </div>
            </div>
            <!-- </van-pull-refresh> -->
          </div>
          <div class="btm_click" @click="openAddr">点击查看更多结果</div>
        </van-tab>
      </van-tabs>

    </page-content>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="salesNetWorkShow">
      <van-picker :columns="netWorkColumns" show-toolbar title="营业网点" @confirm="choice_netWork" @cancel="salesNetWorkShow=false" />
    </van-popup>
    <!-- 底部地址弹出层 -->
    <van-popup v-model="addrShow" position="bottom" class="addr_popup" :overlay="true">
      <div class="tab_box popup_tab" v-for="item in noteData" :key="item.long_lat" @click="getMapForTable(item)">

        <div class="item_box" style="display: flex">
          <div style="flex: 1">
            <div class="tab_name">
              {{item.name}}
            </div>
            <div class="tab_addr">
              <span>
                <van-icon name="location" color="#7C8EAA" style="font-size:12px" />&nbsp;&nbsp;&nbsp;{{item.distance}}km&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>{{item.address}}</span>
            </div>
            <div class="tab_content">
              服务时间：{{item.businessHour}}
            </div>
            <div class="tab_content">
              联系电话：{{item.telephone}}
            </div>
          </div>

          <div class="tab_right">
            <van-button class="tab_btn" plain hairline type="info" icon="/wxcss2/static/img/daohang.png">导航</van-button>
          </div>
        </div>
      </div>
    </van-popup>

  </div>
</template>
<script>
import { PullRefresh, Tab, Tabs } from 'vant';
import myHeader from '@/comments/myHeader'
export default {
  components: {
    myHeader
  },
  data() {
    let self = this;
    return {
      newCityMap:{},
      newAreaMap:{},
      active: 2,
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      zoom: 11,
      center: [121.59996, 31.197646],
      markers: [],
      windows: [],
      window: '',
      // plugin: [{
      //   pName: 'ToolBar',
      //   events: {
      //     init(instance) {

      //     }
      //   }
      // }],
      plugin: [{
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                self.lng = result.position.lng;
                self.lat = result.position.lat;
              }
            });
          }
        }
      }],
      noteData: [],
      // 当前位置经纬度
      myAddress: [],
      companyData: [],
      second_sel: null,
      first_sel: null,
      groupCode: null,
      wxData: null,
      location: null,
      userbindCompany: [],

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

      networkName: "",
      salesNetWorkShow: false,
      netWorkColumns: [],
      initConfigUrl: '',//微信配置路径
      addrShow: false
    }
  },
  // mounted
  created() {
    // this.initConfigUrl = window.location.href.split('#')[0]+'#/salesNetwork'
    // console.log(this.initConfigUrl);

    // http://192.168.137.137:8086/#/salesNetwork
    //this.queryCompanyMes();
    // 高德定位
    // this.getGeolocation()
    // 微信定位
    this.initConfigMes1()
    // setTimeout(() => {
      $('#myTitle').html("营业网点")
      this.getArrList2();
      this.initConfigMes();//加载微信配置
    // }, 0);

  },
  methods: {
    display(e) {
      console.log(e, '666')
      this.addrShow = false
      this.relationShow = false
    },
    openAddr() {
      // console.log(this.noteData);
      this.addrShow = true
      // console.log(this.addrShow);
      // let val = [
      //   {code: "010000", name: '广东省'},
      //   {code: "010100", name: '广州市'},
      //   {code: "01013", name: '南沙区'},
      // ]
      // this.sure(val)
    },
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
        this.getArrList2();
        this.initConfigMes();//加载微信配置
      }, 500);
    },

    // 点击展示地址弹窗
    showNetWork() {
      this.salesNetWorkShow = true
      this.relationShow = false
    },


    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
      this.salesNetWorkShow = false
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.groupCode = val[1].code.slice(2)
        this.groupName = val[0].name + val[1].name
        // this.groupName = val[1].name
      } else {
        this.groupCode = val[2].code.slice(4);
        this.groupName = val[0].name + val[1].name + val[2].name
        // this.groupName = val[2].name
      }
      // this.groupCode = this.common.codeTrans(this.groupCode,this.newAreaMap)
      this.groupCode = this.common.codeTransCity(this.groupCode,this.newCityMap);
      this.groupName = this.groupName.replace('*', '')
      this.relationShow = false
      this.first_sel = this.groupCode;
      this.choice_company(this.groupCode);
      if (this.active == 1) {
        // 展示底部地址弹出框
        this.addrShow = true
      }

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

        //用户绑定的水司
        _this.userbindCompany = JSON.parse(localStorage.getItem('bwcList'))
        //设定默认值
        if (_this.userbindCompany[0]) {
          _this.first_sel = _this.userbindCompany[0].groupCode;
          _this.groupName = _this.userbindCompany[0].groupName;

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
          //获取城市
          // _this.groupName = _this.userbindCompany[0].city;

          _this.groupCode = _this.first_sel;
          _this.choice_company(_this.first_sel);
        } else {

          //默认获取第一个
          // _this.first_sel = _this.areaList.county_list;

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
          _this.querySalesNetWok(_this.groupCode)
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
        _this.querySalesNetWok(_this.groupCode)
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
            // alert(JSON.stringify(result))
            _this.getSpaceNum(result.position.lng, result.position.lat)
          } else {
            // _this.onError(result)
          }
        });
      });
    },

    initConfigMes() {
      let _this = this;
      let params = {
        "data": {
          // "url": window.location.href
          "url": window.location.href.split('#')[0]
          // url:_this.initConfigUrl,
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/wxConfigMes', //接口地址
      }).then(res => {
        _this.wxData = res;
        _this.wx.config({
          // debug: false, //调试阶段建议开启  
          appId: res.appId, //APPID  
          timestamp: res.timestamp, //时间戳timestamp  
          nonceStr: res.nonceStr, //随机数nonceStr  
          signature: res.signature, //签名signature  
          jsApiList: [
            'openLocation'
          ],
        })
      });
    },
    queryCompanyMes() {
      let _this = this;
      let params = { //接口入参
        "data": {
          "groupCode": _this.groupCode
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/companyList', //接口地址
      }).then(res => {
        _this.companyData = res

        //用户绑定的水司
        _this.userbindCompany = [{
          "groupCode": "1",
          "groupName": "梧州水司",
        },
        {
          "groupCode": "3",
          "groupName": "南沙水司",
        },
        {
          "groupCode": "2",
          "groupName": "肇庆水司",
        }
        ]
        //设定默认值
        if (_this.userbindCompany[0]) {
          _this.first_sel = _this.userbindCompany[0].groupCode;
        } else {
          _this.first_sel = _this.companyData[0].groupCode;
        }
        _this.choice_company();

      });
    },
    //查询营业网点
    querySalesNetWok(groupCode) {
      this.networkName = "",
        this.markers = [];
      this.windows = [];

      let markers = [];
      let windows = [];

      this.netWorkColumns = [];
      let netWorkColumns = [];


      let _this = this;
      let params = { //接口入参
        "data": {
          "groupCode": groupCode
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/storesList', //接口地址
      }).then(res => {
        _this.noteData = res
        // alert(JSON.stringify(_this.myAddress))
        // alert(_this.myAddress)
        // alert(Number(_this.myAddress[0]))
        // alert(Number(_this.myAddress[1]))
        for (let i = 0; i < _this.noteData.length; i++) {
          var arr = _this.noteData[i].long_lat.split('-')
          _this.noteData[i].lng = arr[0]
          _this.noteData[i].lat = arr[1]
          _this.noteData[i].distance = 0
          _this.noteData[i].distance = _this.GetDistance(Number(_this.myAddress[0]), Number(_this.myAddress[1]), Number(arr[0]), Number(arr[1]))
          _this.noteData[i].distance = _this.noteData[i].distance.toFixed(2)// 保留两位小数
          // 如果是NaN,则修改为--
          if (isNaN(_this.noteData[i].distance)) {
             _this.noteData[i].distance = '--'
          }
        }
        let num = res;
        let self = this;
        if (num.length < 1) {
          return null
        }
        for (let i = 0; i < num.length; i++) {
          let arr = num[i].long_lat.split("-")
          markers.push({
            position: [arr[0], arr[1]],

            text: '<img src="/wxcss2/static/img/zuobiao1.png" alt="">  ' + num[i].name + '&nbsp;',
            visible: true,
            offset: [0, -50],

            events: {
              click() {
                self.windows.forEach(window => {
                  window.visible = false;
                });
                self.window = self.windows[i];
                self.$nextTick(() => {
                  self.window.visible = true;
                  _this.second_sel = i;
                });
              }
            }
          });
          windows.push({
            position: [arr[0], arr[1]],
            content: `${num[i].name}`,
            visible: false,
          });
          netWorkColumns.push(
            `${num[i].name}`
          )
        }
        _this.markers = markers;
        console.log(_this.markers);
        _this.windows = windows;
        _this.netWorkColumns = netWorkColumns;
        _this.center = markers[0].position;

        //默认选取第一个营业网点
        _this.second_sel = 0;
        _this.choice_sec();
      })
    },
    getMapForTable(item) {
      // alert(JSON.stringify(item))
      let _this = this;
      this.salesNetWorkShow = false
      this.relationShow = false

      _this.wx.openLocation({
        longitude: parseFloat(item.lng), // 经度，浮点数，范围为180 ~ -180。
        latitude: parseFloat(item.lat), // 纬度，浮点数，范围为90 ~ -90
        name: item.name, // 位置名
        address: item.name, // 地址详情说明
        scale: 14,
      });
    },
    getMap() {
      let _this = this;
      this.salesNetWorkShow = false
      this.relationShow = false
      _this.wx.openLocation({
        longitude: parseFloat(_this.location.position[0]), // 经度，浮点数，范围为180 ~ -180。
        latitude: parseFloat(_this.location.position[1]), // 纬度，浮点数，范围为90 ~ -90
        name: _this.location.content, // 位置名
        address: _this.location.content, // 地址详情说明
        scale: 14,
      });
    },
    choice_company(value) {
      this.querySalesNetWok(this.first_sel)
    },

    choice_netWork(value, index) {
      this.salesNetWorkShow = false;
      if (index.length == 0) {
        return null;
      }
      this.second_sel = index;
      this.choice_sec();
    },
    choice_sec(value) {
      let self = this;
      self.windows.forEach(window => {
        window.visible = false;
      });
      self.window = self.windows[this.second_sel];
      self.$nextTick(() => {
        self.window.visible = true;
      });
      this.networkName = self.windows[this.second_sel].content;
      this.center = self.windows[this.second_sel].position;
      this.location = self.windows[this.second_sel];
    },



    // 获取当前位置经纬度
    getGeolocation() {
      let that = this
      var map = new AMap.Map('container', {
        resizeEnable: true
      });
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition: 'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
          // alert(status)//error
          // alert(result)//object
          // alert(JSON.stringify(result))
          // alert(result.position);//undefined
          // alert(result.location_type);
          // alert(result.accuracy);
          // alert(result.position.lng);
          // alert(result.position.lat);
          if (status == 'complete') {
            that.myAddress.push(result.position.lng)
            that.myAddress.push(result.position.lat)
          } else {
            // that.onError(result)
          }
        });
      });
    },

    initConfigMes1() {
      //微信的定位
      let _this = this;
      let params = {
        data: {
          url: window.location.href.split('#')[0]
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/wxConfigMes', //接口地址
      }).then(res => {
        // 微信注册
        _this.wx.config({
          // debug: true, //调试阶段建议开启  
          appId: res.appId, //APPID  
          timestamp: res.timestamp, //时间戳timestamp  
          nonceStr: res.nonceStr, //随机数nonceStr  
          signature: res.signature, //签名signature  
          jsApiList: [
            'getLocation'
          ],
        });
        _this.wx.ready(res => {
          // 调用
          _this.wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              _this.myAddress.push(res.longitude)
              _this.myAddress.push(res.latitude)
            },
            fail: function (err) {
              // alert(JSON.stringify(err))
            }
          });
        })

      });
    },



    //解析定位结果
    onComplete(data) {
      // document.getElementById('status').innerHTML='定位成功'
      var str = [];
      str.push('定位结果：' + data.position);
      str.push('定位类别：' + data.location_type);
      if (data.accuracy) {
        str.push('精度：' + data.accuracy + ' 米');
      }//如为IP精确定位结果则没有精度信息
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
      console.log(str)
      // alert('定位成功' + str)
      // document.getElementById('result').innerHTML = str.join('<br>');
    },
    //解析定位错误信息
    onError(data) {
      console.log('定位失败')
      console.log(data.message)
      // alert('定位失败' + data.message)
      // document.getElementById('status').innerHTML='定位失败'
      // document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
    },
    // 计算当前定位与营业厅之间的距离
    GetDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;// EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      return s;
    }
  }
}

</script>

<style scoped lang="less">
.sales-network {
  .van-tabs__line {
    background-color: #1a73e8;
  }
  .tab_box {
    padding: 15px;
    padding-bottom: 0;
    .item_box {
      border-bottom: 1px solid #d0d0d0;
      padding-bottom: 10px;
    }
    .tab_name {
      font-size: 18px;
      // font-weight: bold;
    }
    .tab_addr {
      font-size: 13px;
      margin-top: 15px;
      color: #94979b;
    }
    .tab_content {
      font-size: 13px;
      margin-top: 5px;
      color: #94979b;
    }
    .tab_line {
      width: 100%;
      height: 1px;
      background: #d0d0d0;
      margin: 0 auto;
      margin-top: 15px;
    }
  }
  .tab_right {
    padding-top: 35px;
    .tab_btn {
      color: black;
      border: 1px #a8aaae solid;
      border-radius: 30px;
      height: 33px;
      line-height: 33px;
    }
    .van-image {
      color: black;
    }
  }
  .popup_tab {
  }
  .van-tabs {
    height: 100%;
    .van-tabs__wrap {
      height: 10%;
    }
  }
  .search_box {
    position: absolute;
    z-index: 9999;
    height: 35px;
    // margin-left: 10%;
    // margin-top: 4%;
    top: 8%;
    left: 3%;
    width: 94%;
    .van-field {
      border-radius: 12px;
      box-shadow: 0px 3px 7px -4px;
    }
    .van-cell-group {
      height: 127%;
    }
    .koron_vant1 {
      display: inline-block;
      width: 25%;
      padding: 10px;
      .van-field__body {
        border-right: 1px solid #888888;
      }
    }
    .koron_vant2 {
      display: inline-block;
      width: 45%;
      padding: 10px 5px;
    }
    .koron_vant3 {
      display: inline-block;
      width: 24%;
      padding: 10px;
      background: #454545;
      float: right;
    }
    //width: 100%;
    .first_sel {
      height: 1.7rem;
      width: 35%;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .second_sel {
      width: 35%;
      // color: #CACACA;
      height: 1.7rem;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .third_btn {
      width: 18%;
      display: inline-block;
      // width: 3rem;
      background: #454545;
      color: white;
      text-align: center;
      font-size: 13px;
      height: 1.65rem;
      line-height: 36px;

      img {
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -5px;
        margin-left: 3px;
      }

      span {
        margin-left: -5px;
        margin-right: 17px;
      }
    }
  }

  .content-padded {
    height: 100%;
    margin: 0;

    .list {
      margin: 0;
    }

    .amap-demo {
      height: 88.7vh;
      // border: 1px solid gray;
    }

    .prompt {
      background: white;
      width: 100px;
      height: 30px;
      text-align: center;
    }
  }

  .kr-map {
    // padding: 10px;
    height: 100%;
  }
  .addr_popup {
    max-height: 345px;
  }
  .van-overlay {
    //去掉遮罩层
    // display: none;
  }
  .btm_click {
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100%;
    background: #fff;
    height: 35px;
    line-height: 35px;
    box-shadow: 1px 0px 8px 1px;
    font-size: 14px;
  }
}
</style>
