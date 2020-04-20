<template>
  <div class="fast-pay">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>快速缴费</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :isShow="isShow" :title='title' class="myheader"></myHeader> -->
        <headerThree :message='message' class="myheader"></headerThree>
        <div class="row bottom_content" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <div class="col-100">
            <div class="kr-body">
              <div class="kr-body-info">
                <div class="kr-containt">
                  <div class="kr-div">
                    <van-field class="yh-my-blue kr-select" left-icon="location-o" readonly v-model="userlist.address" placeholder="请选择所属地区" label="所属地区" right-icon="arrow" @click="showAddressChuang" @click-right-icon="showAddressChuang" />
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <van-field class="yh-my-red" left-icon="user-o" v-model="needData.userNo" label="用户编号" placeholder="请输入用户编号" clearable oninput="this.value=this.value.replace(/[^0-9.a-zA-Z]+/,'');" size="large" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 所属地区 -->
            <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
              <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
            </van-popup>
            <p class="form-button">
              <m-button size="large" @click.native="goRecharge" class="kr-btn" style="display: inline-block;width: 93%;font-size: 20px;background: #479EFF; color: #fff;">
                查询欠费
              </m-button>
            </p>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>

<script>
import { Toast, PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      newAreaMap:{},
      newCityMap:{},
      message: {
        title: "为其他户号缴费",
        span1:"",
        span2:"",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: "为其他户号缴费",
      relationShow: false,
      arrListName: [],
      arrListCode: [],
      isShow: 2,
      needData: {
        groupName: "",
        userNo: "",
        groupCode: "",
      },

      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      userlist: {
        address: '',
      },
    }
  },
  mounted() {
    // if(localStorage.getItem('isMoreUser')=='2'&&sessionStorage.getItem('moreUser')!=='2'){
    //   sessionStorage.setItem('moreUser','1')
    // }
    this.getArrList3()
  },
  methods: {
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.getArrList3()
      }, 500);
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

    getArrList() {
      let _this = this
      let params = {
        "data": {},
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/wCompanyList',//接口地址
      }).then(res => {
        for (let i = 0; i < res.length; i++) {
          console.log(res);
          _this.needData.groupName = res[0].groupFullName;
          _this.needData.groupCode = res[0].groupCode;
          _this.arrListName.push(res[i].groupFullName);
          _this.arrListCode.push(res[i].groupCode)
        }
      })
    },
    goRecharge() {
      let _this = this
      let message = ""
      if (_this.needData.groupCode == '') {
        message = '所属区域不能为空';
        Toast.fail(message);
        return
      } else if (_this.needData.userNo == '') {
        message = '用户编号不能为空';
        Toast.fail(message);
        return
      }
      let params = {
        "data": {
          area: _this.needData.groupCode,
          userNo: _this.needData.userNo,
          billStatus: '3',
        }
      }
      _this.$api.fetch({
        params,//参数
        // apiUrl: '/myWater/unBindUserBill',//接口地址
        apiUrl: '/myWater/unBindUserBill',
      }).then(res => {
        let item = { type: '1' }//这里是动态的？根据type的值来判断来显示哪部分？
        localStorage.setItem('isHide', '1');
        localStorage.setItem('userNo', _this.needData.userNo);
        localStorage.setItem('groupCode', _this.needData.groupCode);
        localStorage.setItem('num', '0');
        localStorage.setItem('groupOpenId', 'null')
        if (res.billList.length == 0) {
          item.isShow = true;
        } else {
          item.isShow = false;
        }
        _this.$router.push({ path: '/recharge', query: item })
      })
    },

    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.needData.groupCode = val[1].code.slice(2)
        this.userlist.address = val[0].name + val[1].name
      } else {
        this.needData.groupCode = val[2].code.slice(4);
        this.userlist.address = val[0].name + val[1].name + val[2].name
      }
      this.needData.groupCode = this.common.codeTransCity(this.needData.groupCode,this.newCityMap);
      // this.needData.groupCode = this.common.codeTrans(this.needData.groupCode,this.newAreaMap)
      this.userlist.address = this.userlist.address.replace('*', '')
      console.log(this.needData.groupCode);
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
          openId: localStorage.getItem('openId')
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/wAreaTree',//接口地址
      }).then(res => {
        let province_list = {};//省
        let city_list = {};//市
        let county_list = {};//区
        let child = [];
        let son = [];
        let ii = '';
        let jj = '';
        let kk = '';
        if (res.length !== 0) {
          for (let i = 0; i < res.length; i++) {//省
            let value = res[i].value;
            if (parseInt(i + 1) < 10) {
              ii = '0' + (i + 1)
            } else {
              ii = i + 1
            }
            province_list[ii + '0000'] = value;
            child = res[i].children
            if (child.length !== 0) {
              for (let j = 0; j < child.length; j++) {//市
                let value = child[j].value;
                son = child[j].children;
                if (parseInt(j + 1) < 10) {
                  jj = '0' + (j + 1)
                } else {
                  jj = j + 1
                }
                if (son.length == 0) {
                  let code = child[j].groupCode;
                  city_list[ii + jj + code] = value;
                } else {
                  city_list[ii + jj + '00'] = value;
                }

                if (son.length !== 0) {
                  for (let k = 0; k < son.length; k++) {//区
                    let value = son[k].value;
                    let code = son[k].groupCode;
                    county_list[ii + jj + code] = value;
                  }
                }
              }
            }
          }
        }
        _this.areaList.province_list = province_list;
        _this.areaList.city_list = city_list;
        _this.areaList.county_list = county_list;
      })
    },
    getArrList3() {
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
        _this.areaList.province_list = res.provinceMap;//省
        // _this.areaList.city_list = res.cityMap;//市
        // _this.areaList.county_list = res.areaMap;//区
        _this.newAreaMap = res.areaMap;
        _this.newCityMap = res.cityMap;
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区

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
          _this.needData.groupCode = bindData[0].groupCode
          _this.userlist.address = bindData[0].groupName

          let incode = _this.needData.groupCode;
          let countylist = _this.areaList.county_list;//区
          let citylist = _this.areaList.city_list;//市
          let areanum = _this.areaNum;
          _this.areaNum = _this.common.companyTree(incode,countylist,citylist,areanum);
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
        _this.$set(_this.needData, 'groupCode', res.groupCode)
        _this.$set(_this.userlist, 'address', res.groupArea)
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

    //展开关系遮罩层
    selectRelation() {
      this.relationShow = true;
    },
    // 关系遮罩层返回按钮
    onCancelRelation() {
      this.relationShow = false;
    },
    // 关系遮罩层确定按钮  
    onConfirmRelation(value, index) {//所属地区
      this.needData.groupCode = this.arrListCode[index];
      this.needData.groupName = value
      this.relationShow = false;
    },
  }
}
</script>

<style scoped lang="less">
.fast-pay {
  .van-cell--large{
    padding:12px 0;
  }
  .icon {
    transform: rotate(90deg);
    display: inline-block;
  }
  .form-button {
    text-align: center;
    // width: 97%;
    .kr-btn {
      display: inline-block;
      width: 93%;
      // font-family: PingFang_Medium;
      font-size: 20px;
      background: #479eff;
      color: #fff;
    }
  }
  .user_inp {
    border: none;
    height: 80%;
    // font-family: PingFang_Medium;
    font-size: 15px;
  }
  .add_content {
    display: inline-block;
    position: absolute;
    top: 26.5%;
    right: 10px;
    font-size: 50px;
    color: #fff;
    background: #ed702d;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
  }
  .bottom_content {
    width: 94%;
    position: absolute;
    // top: 23%;
    top:6rem;
    left: 3%;
    margin: 0px 0px 10px 0px;
    .col-100 {
      text-align: center;
      width: 100%;
      margin-left: 0%;
    }
    .button {
      background-color: white;
      color: #b6b6b6;
      font-size: 1rem;
    }
  }

  .content-padded {
    margin: 0;
    height: 100%;
    .myheader {
      // height: auto;
      height: 9rem;
      // padding:0 0 5% 0 !important;
    }
  }
  .row {
    margin-left: 0%;
  }
  .col-100 {
    .midle-bar {
      padding: 0 10px 0 15px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      b {
        font-size: 20px;
        line-height: 40px;
      }
    }
    .kr-body {
      padding: 3% 3%;
      .kr-body-info {
        border-radius: 5px;
        background: #fff;
        box-shadow: 1px 1px 5px 1px #888;
        .kr-containt {
          .kr-div {
            // border-bottom: 1px solid #ebebeb;
            padding: 10px;
            // font-family: PingFang_Regular;
            font-weight: 300;
            font-size: 15px;
            .kr-select {
              padding: 10px 0px;
              // .van-cell__value {
              //   .van-field__body {
              //     padding: 0 0 0 0;
              //   }
              // }
            }
            .kr-name {
              display: inline-block;
              width: 30%;
              // font-family: PingFang_Bold;
              font-weight: 600;
            }
            .kr-title {
              color: #000;
              // font-family: PingFang_Bold;
              font-weight: 600;
            }
            input,
            select {
              color: #000;
              // font-family: PingFang_Bold;
              font-weight: 600;
              border: 0;
            }
            select {
              width: 30%;
            }
          }
          .kr-line {
            width: 90%;
            height: 1px;
            background: #ebebeb;
            margin: 0 auto;
          }
        }
      }
    }
  }
}
</style>