<template>
  <div class="myMap">
    <page-content>
      <!-- <myHeader :title="title"></myHeader> -->
      <!-- <van-nav-bar :title="title" left-text="返回" right-text="确定" left-arrow @click-left="onClickLeft" @click-right="onClickRight" /> -->
      <van-nav-bar left-text="返回" right-text="确定" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
      <div class="map_content">
        <div class="amap-page-container">
          <el-amap-search-box class="search-box" :search-option="searchOption" @keyup.enter="onSearchResult" :on-search-result="onSearchResult">
          </el-amap-search-box>
          <el-amap vid="amapDemo" :plugin="plugin" class="amap-demo" :center="center" :zoom="zoom" :events="events">
            <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
          </el-amap>
          <!-- <div class="toolbar">报修地址:{{ address }} </div> -->
          <!-- <div class="toolbar">坐标:[{{ lng }}, {{ lat }}] </div> -->
          <van-field class="kron-field" label="报修地址：" rows="3" autosize type="textarea" :value="address" placeholder="请选择报修地址" readonly />
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import { Toast } from 'vant'
export default {
  components: {
    myHeader,
  },
  props: ['mapNeedData', 'leakAddress'],
  data() {
    let self = this;
    return {
      title: '报修地点',
      zoom: 16,
      center: [121.52014, 31.198862],
      searchOption: {
        city: '深圳市',
        citylimit: true
      },
      marker: {
        position: [121.52014, 31.198862]
      },
      address: '',
      lng: 0,
      lat: 0,
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.marker.position = [lng, lat]
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      plugin: [{
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                //高德地图的定位
                self.lng = result.position.lng;
                self.lat = result.position.lat;
                self.center = [self.lng, self.lat];
                self.marker.position = [self.lng, self.lat];

                var geocoder = new AMap.Geocoder({
                  radius: 1000,
                  extensions: "all"
                });
                geocoder.getAddress([self.lng, self.lat], function (status, result) {

                  if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                      self.address = result.regeocode.formattedAddress;
                      self.$nextTick();
                    }
                  }
                });
                self.$nextTick();
              }
            });
          },

        }
      }]

    }
  },
  mounted() {
    // 微信自带定位
    this.initConfigMes();
    // 高德定位
    // this.getUserMes();

    // 修改搜索框样式
    $('.myMap .search-box .search-box-wrapper input').attr('placeholder', '查找地点')
    let div = '<img src="../../../static/img/fangdajing.png" alt="" height="22px" style="margin-left:2%">'
    $('.myMap .search-box .search-box-wrapper input').before(div)

  },
  methods: {
    getUserMes() {
      this.searchOption = {
        city: this.mapNeedData.province,
        citylimit: true
      }
      this.title = this.mapNeedData.province;
      this.$nextTick();
    },
    onSearchResult(pois) {
      console.log(pois);
      var _this = this
      var lng = pois[0].lng
      var lat = pois[0].lat
      this.center = [lng, lat];
      this.marker.position = [lng, lat]
      //地址转换中文
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress([lng, lat], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            _this.address = result.regeocode.formattedAddress;
            _this.$nextTick();
          }
        }
      });
    },

    initConfigMes() {
      //微信的定位
      let _this = this;
      this.title = this.mapNeedData.province;
      let params = {
        data: {
          url: window.location.href
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/wxConfigMes', //接口地址
      }).then(res => {
        _this.wxData = res;
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
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度

              _this.lng = longitude;
              _this.lat = latitude;
              _this.center = [longitude, latitude];
              _this.marker.position = [longitude, latitude];
              //地址转换中文
              // var geocoder = new AMap.Geocoder({
              //   radius: 1000,
              //   extensions: "all"
              // });
              var geocoder = new AMap.Geocoder()
              geocoder.getAddress([longitude, latitude], function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    _this.address = result.regeocode.formattedAddress;
                    _this.$nextTick();
                  }
                }
              });
              _this.$nextTick();
              //   _this.$nextTick(() => {
              // });
            },
            fail: function (err) {
            }
          });
        })

      });
    },
    onClickLeft() {
      this.backChange(0)
    },
    onClickRight() {
      if (this.address == '') {
        Toast.fail('报障地点不能为空');
        return
      }
      this.backChange(1)
    },
    backChange(num) {
      var item = {}
      if (num == 0) {
        item.address = this.leakAddress;
      } else if (num == 1) {
        item.address = this.address
      }
      this.BUS.$emit('getAddress', item.address)
      this.$parent.leakandrepairsShow = true
      this.$parent.repairMapShow = false
    }
  }
}
</script>

<style scoped lang="less">
.myMap {
  .el-vue-search-box-container .search-tips {
    border: none;
  }
  .map_content {
    height: 93%;
    margin: 0;
    .amap-page-container {
      .search-box {
        width: 90%;
        height: 46px;
        line-height: 46px;
        position: absolute;
        top: 55px;
        left: 5%;
      }
      .kron-field {
        // height: 18%;
      }
      height: 86%;
    }
  }
  
}
</style>