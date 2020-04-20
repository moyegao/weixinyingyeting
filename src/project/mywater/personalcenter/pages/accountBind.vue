<template>
  <div class="account-bind">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账号绑定</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title='title' class="myheader"></myHeader> -->
        <headerThree :message='message'></headerThree>
        <div class="row bottom_content">
          <div class="col-100 user_content">
            <div class="kr-body">
              <div class="kr-body-info">
                <div class="kr-containt">

                  <!-- <div class="kr-div">
                    <van-field 
                              clearable 
                              v-model="list.groupFullName" 
                              label="所属地区" 
                              readonly 
                              placeholder="请选择所属地区" 
                              right-icon="arrow" 
                              size="large" 
                              @click="selectRelation(0)" 
                              @click-right-icon="selectRelation(0)" />
                  </div> -->
                  <div class="kr-div">
                    <van-field class="yh-my-blue" left-icon="location-o" readonly v-model="userlist.address" placeholder="请选择所属地区" label="所属地区" right-icon="arrow" @click="showAddressChuang" @click-right-icon="showAddressChuang" />
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <van-field class="yh-my-red" left-icon="records" v-model="list.typeName" label="绑定方式" readonly placeholder="请选择绑定方式" right-icon="arrow" size="large" @click="selectRelation()" @click-right-icon="selectRelation()" />
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <!-- type="number" -->
                    <van-field :type="type" class="yh-my-blue" :left-icon="leftIocn" v-model="list.value" :label="options[num]" :placeholder="'请输入'+options[num]" oninput="this.value=this.value.replace(/[^0-9.a-zA-Z]+/,'');" @blur="inputNum(list.value)" clearable size="large" />
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <van-field type="text" class="yh-my-red" left-icon="user-o" v-model="list.name" label="用户名称" placeholder="请输入用户名称" clearable size="large" @blur="inputUserName(list.name)" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 所属地区 -->
            <!-- <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
              <van-picker 
                          class="timepicker" 
                          show-toolbar title="所属地区" 
                          :columns="arrListName" 
                          @cancel="onCancelRelation" 
                          @confirm="onConfirmRelation" />
              </van-popup> -->
            <!-- 所属地区 -->
            <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
              <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" id="yh-area" />
            </van-popup>
            <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShipShow">
              <van-picker class="timepicker" show-toolbar title="绑定方式" :columns="options" @cancel="onCancelRelation1" @confirm="onConfirmRelation1" />
            </van-popup>
            <div class="content-block submit_btn">
              <div class="row">
                <div class="col-100">
                  <m-button size="large" :active="true" @click.native="submit">绑定</m-button>
                </div>
              </div>
            </div>
            <!-- <div class="kr-link">
              <router-link to='/'>
                忘记用户编号了?点我用身份证试试!
              </router-link>
            </div> -->
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
</template>

<script>
import addressList from "@/assets/js/area";
import headerThree from '@/comments/headerThree';
import { Toast, Popup, Area, PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader';
export default {
  components: {
    myHeader, headerThree,
    "van-popup": Popup,
    "van-area": Area
  },
  data() {
    return {
      leftIocn: "phone-o",//绑定方式不同的图标
      message: {
        title: "账号绑定",
        span1:"",
        span2:"",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: "账号绑定",
      type: 'number',
      num: 0,
      reg: '',//正则表达式
      // message: '',//错误的提示消息
      valTrue: 1,
      relationShow: false,
      relationShipShow: false,
      list: {
        openId: "1",
        groupCode: "",
        groupFullName: "1",
        type: "1",
        typeName: "手机号",
        value: "",
        name: ""
      },
      // '账户编号','客户编号',
      // options: ['手机号', '身份证号', '营业执照号', '用户编号', '银行卡号'],
      options: ['手机号','用户编号', '身份证号', '营业执照号',  '银行卡号'],
      arrList: [],
      arrListName: [],
      arrListCode: [],

      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      //从后端返回的数据 区
      newAreaMap:{},
      //从后端返回的数据 市
      newCityMap:{},
      userlist: {
        address: '',
      },
    }
  },
  mounted() {
    console.log(this.areaList);
    this.getArrList()
    // Toast.fail("1111");
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
        this.getArrList();
      }, 500);
    },

    // 点击展示地址弹窗
    showAddressChuang() {
      // let needArr = [];
      // for (const key in this.areaList.county_list) {//区
      //   console.log(this.areaList.county_list[key]);
      //   if (this.areaList.county_list[key].indexOf('*') > -1) {
      //     needArr.push(this.areaList.county_list[key]);
      //     console.log(needArr);
      //     console.log(key);
      //     console.log(this.areaList.county_list[key]);
      //     console.log($('#yh-area .van-picker-column .van-picker-column__item').html());
      //     $('#yh-area .van-picker-column .van-picker-column__item').addClass('company-area-active')
      //   } else {
      //     for (const item in this.areaList.city_list) {//市
      //       if (this.areaList.city_list[item].indexOf('*') > -1) {
      //         console.log('dw');
      //         $('#yh-area .van-picker-column .van-picker-column__item').eq(0).addClass('company-area-active')
      //       }
      //     }
      //   }
      // }
      // $('#yh-area .van-picker-column .van-picker-column__item--selected').addClass('company-area-active')
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      // val选中的那行 省市区/省市
      console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        //市
        this.list.groupCode = val[1].code.slice(2);
        // this.userlist.address = val[0].name + "-" + val[1].name;
        this.userlist.address = val[0].name + val[1].name;
      } else {
        //区
        this.list.groupCode = val[2].code.slice(4);
        // this.userlist.address = val[0].name + "-" + val[1].name + "-" + val[2].name;
        this.userlist.address = val[0].name + val[1].name + val[2].name;
      }
      // this.list.groupCode = this.common.codeTrans(this.list.groupCode,this.newAreaMap)
      this.list.groupCode = this.common.codeTransCity(this.list.groupCode,this.newCityMap);
      this.userlist.address = this.userlist.address.replace('*', '')
      console.log(this.list.groupCode);
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
        params,//参数
        apiUrl: '/common/wAreaTree',//接口地址
      }).then(res => {
        _this.newCityMap = res.cityMap;
        _this.areaList.province_list = res.provinceMap;//省
        // _this.areaList.city_list = res.cityMap;//市
        // _this.areaList.county_list = res.areaMap;//区
        _this.newAreaMap = res.areaMap;
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        console.log(_this.areaList);
        
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
          _this.list.groupCode = bindData[0].groupCode
          _this.userlist.address = bindData[0].groupName

          let incode = _this.list.groupCode;
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
        _this.$set(_this.list, 'groupCode', res.groupCode)
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
    inputNum(value) {
      let num = this.num;
      console.log(value, num);
      if (num == 0) {
        if (value == '') {
          let message = '手机号不能为空!';
          Toast.fail(message);
          this.valTrue = 0;
          return
        } else if (!/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/.test(value)) {
          let message = '手机号格式有误!';
          Toast.fail(message);
          this.valTrue = 0;
          // that.list.value = '';
          return
        } else {
          this.list.value = value;
          this.valTrue = 1;
        }
      } else if (num == 2) {
        if (value == '') {
          let message = '身份证号不能为空!';
          Toast.fail(message);
          this.valTrue = 0;
          return
        } else if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
          let message = '身份证号格式有误!';
          Toast.fail(message);
          this.valTrue = 0;
          return
          // that.list.value = '';
        } else {
          this.list.value = value;
          this.valTrue = 1;
        }
      } else if (num == 3) {
        if (value == '') {
          let message = '营业执照号不能为空!';
          Toast.fail(message);
          this.valTrue = 0;
          return
        } else if (!/^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$/.test(value)) {
          let message = '营业执照号格式有误!';
          Toast.fail(message);
          this.valTrue = 0;
          return
          // that.list.value = '';
        } else {
          this.list.value = value;
          this.valTrue = 1;
        }
      } else if (num == 1) {
        if (value == '') {
          let message = '用户编号不能为空!';
          Toast.fail(message);
          this.valTrue = 0;
          return
        } else if (!/^[a-zA-Z0-9]{1,16}$/.test(value)) {
          let message = '用户编号格式有误!';
          Toast.fail(message);
          this.valTrue = 0;
          return
          // that.list.value = '';
        } else {
          this.list.value = value;
          this.valTrue = 1;
        }
      }
      // else if(num == 4){
      //   if(value == ''){
      //     let message = '账户编号不能为空!';
      //     Toast.fail(message);
      //     this.valTrue = 0;
      //     return
      //   }else if(!/^[a-zA-Z0-9]{1,16}$/.test(value)){
      //     let message = '账户编号格式有误!';
      //     Toast.fail(message);
      //     this.valTrue = 0;
      //     return
      //     // that.list.value = '';
      //   }else{
      //     this.list.value = value;
      //     this.valTrue = 1;
      //   }
      // }
      // else if(num == 5){
      //   if(value == ''){
      //     let message = '客户编号不能为空!';
      //     Toast.fail(message);
      //     this.valTrue = 0;
      //     return
      //   }else if(!/^[a-zA-Z0-9]{1,16}$/.test(value)){
      //     let message = '客户编号格式有误!';
      //     Toast.fail(message);
      //     this.valTrue = 0;
      //     return
      //     // that.list.value = '';
      //   }else{
      //     this.list.value = value;
      //     this.valTrue = 1;
      //   }
      // }
      else if (num == 4) {
        if (value == '') {
          let message = '银行卡号不能为空!';
          Toast.fail(message);
          this.valTrue = 0;
          return
        } else if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
          let message = '银行卡号格式有误!';
          Toast.fail(message);
          this.valTrue = 0;
          return
          // that.list.value = '';
        } else {
          this.list.value = value;
          this.valTrue = 1;
        }
      }
    },
    inputUserName(val) {//用户名称验证
      if (val === '') {
        let message = '用户名称不能为空!';
        Toast.fail(message);
      }
    },
    submit() {
      let message = ""
      if (this.list.groupCode == '') {
        message = '所属区域不能为空';
        Toast.fail(message);
      } else if (this.list.value == '') {
        message = this.options[this.num] + '不能为空';
        Toast.fail(message);
      } else if (this.list.name == '') {
        message = '用户名称不能为空';
        Toast.fail(message);
      } else {
        let _this = this
        let data = {};
        // data.openId = _this.list.openId;
        data.groupCode = _this.list.groupCode;
        data.type = _this.list.type;
        data.value = _this.list.value;
        data.name = _this.list.name;
        data.openId = localStorage.getItem('openId');
        let params = {
          data,
        }
        if (this.list.value !== '') {
          this.inputNum(this.list.value)
          if (this.valTrue == 1) {
            this.$api.fetch({
              params,//参数
              apiUrl: '/myWater/userBindQuery',//接口地址
            }).then(res => {
              if (res.length > 0) {
                // message = res[0].groupCode;
                // Toast.fail(message);
                localStorage.setItem('groupCode', res[0].groupCode)
              }
              let str = '';
              if (res.length > 1) {
                for (let i = 0; i < res.length; i++) {
                  if (i < res.length - 1) {
                    str += JSON.stringify(res[i]) + '/';
                  } else {
                    str += JSON.stringify(res[i]);
                  }
                }
                _this.$router.push({ path: "/accBind", query: str })
              } else if (res.length == 1) {
                console.log(res[0]);
                str += JSON.stringify(res[0]);
                // _this.$router.push({path:"/bill",query:res[0]})
                _this.$router.push({ path: "/accBind", query: str })
              } else if (res.length == 0) {
                let message = '您想绑定的用户已全部绑定。';
                Toast.fail(message);
              }

            })
          }
        }
        console.log(data);
      }
    },
    // 展开关系遮罩层
    selectRelation() {
      this.relationShipShow = true;
    },
    // 关系遮罩层返回按钮
    onCancelRelation() {
      this.relationShow = false;
    },
    onCancelRelation1() {
      this.relationShipShow = false;
    },
    // 关系遮罩层确定按钮  
    onConfirmRelation(value, index) {//所属地区
      this.list.groupCode = this.arrListCode[index];
      this.list.groupFullName = value
      this.relationShow = false;
    },
    onConfirmRelation1(value, index) {//绑定方式
      console.log(value, index)
      if (index == 1) {//身份证号
        this.leftIocn = 'idcard';
      } else if (index == 2) {//营业执照
        this.leftIocn = 'ecard-pay';
      } else if (index == 3) {//用户编号
        this.leftIocn = 'contact';
      } else if (index == 4) {//银行卡号
        this.leftIocn = 'cash-on-deliver';
      }
      this.num = index;
      this.list.type = (index + 1).toString();
      this.list.typeName = value;
      this.list.value = '';
      this.relationShipShow = false;

      if (this.num == 0) {
        this.type = 'number'
      } else {
        this.type = 'text'
      }
    },
  }
}
</script>

<style scoped lang="less">
.account-bind {
  .content-padded {
    margin: 0;
    height: 100%;
    .myheader {
      // height: auto;
      height: 9rem;
      // padding:0 0 5% 0 !important;
    }
    .img_content {
      height: 9rem;
    }
  }
  .submit_btn {
    margin-top: 4%;
  }
  .bottom_content {
    width: 94%;
    position: absolute;
    // top: 20%;
    top: 6rem;
    left: 3%;
    margin-left: 0%;
    .col-100 {
      // text-align: center;
      width: 100%;
      margin-left: 0%;
    }
  }
  .content-block {
    .col-100 {
      text-align: center;
      margin-left: 2%;
    }
    a {
      font-size: 0.9rem;
      height: 2.8rem;
      line-height: 2.8rem;
      width: 88%;
      background: #479eff;
      display: inline-block;
      border-radius: 3px;
      font-weight: 500;
    }
  }
  .kr-link {
    padding: 10px 6%;
    .router-link-active {
      color: #4da0fe;
      font-size: 15px;
      // font-family: PingFang_Bold;
      display: inline-block;
      border-bottom: 1px solid #4da0fe;
    }
  }
  .col-100 {
    .kr-body {
      padding: 10px 10px;
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
            font-size: 16px;
            .van-field__body {
              padding: 0;
            }
            .van-cell {
              padding: 10px 0;
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
