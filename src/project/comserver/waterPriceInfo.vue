<template>
  <div class="water-price-info">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>水价信息</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title='title'></myHeader> -->
        <!-- <headerThree :message='message'></headerThree> -->
        <!-- <div class="header-img">
          <img src="../../../static/img/header1.png" alt="">
        </div> -->
        <div class="row content-body">
          <!-- <div class="col-100 search_content">
            <van-cell-group>
              <van-field class="koron_search" right-icon="arrow" :value="groupName" label="选择地区" readonly size="large" placeholder="请选择水司区域" @click="showAddressChuang" />
            </van-cell-group>
          </div> -->
          <div class="col-100 kr-img" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div v-if='infoData.length !== 0'>
              <p v-html="infoData.content"></p>
            </div>
            <div v-else class="no-div">
              <div style="width:100%;">
                暂无水价信息数据
              </div>
            </div>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
  </div>
</template>

<script>
import { PullRefresh } from 'vant';
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader,
    headerThree
  },
  data() {
    return {
      newAreaMap:{},
      newCityMap:{},
      message:{
        title:"水价信息",
        span1:"足不出户",
        span2:"在家看水价信息",
        isShow: '',
      },
      title:"水价信息",
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      fastpay: require('../../../static/img/banner-pic.png'),
      comp: require('@/project/assets/images/form/i-form-name.png'),
      notePic: require('@/project/assets/images/home/modal.png'),
      waterprice: require('../../../static/img/shuijia.png'),
      infoData: [],
      companyData: [],
      first_sel: null,
      groupCode: null,
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
    }
  },
  mounted() {
    // if(localStorage.getItem('isMoreUser')=='2'&&sessionStorage.getItem('moreUser')!=='2'){
    //   sessionStorage.setItem('moreUser','1')
    // }
    // this.queryCompanyMes();
    // this.getArrList2();
    $('#myTitle').html(this.title)
    this.queryInfo(localStorage.getItem('groupCode'));
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
        this.getArrList2();
      }, 500);
    },

    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.groupCode = val[1].code.slice(2)
        this.groupName = val[0].name + val[1].name
      } else {
        this.groupCode = val[2].code.slice(4);
        this.groupName = val[0].name + val[1].name + val[2].name
      }
      // this.groupCode = this.common.codeTrans(this.groupCode,this.newAreaMap)
      this.groupCode = this.common.codeTransCity(this.groupCode,this.newCityMap);
      this.groupName = this.groupName.replace('*', '')
      this.relationShow = false
      //查询通告列表
      this.first_sel = this.groupCode;
      this.queryInfo(this.groupCode);
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
          _this.groupCode = _this.first_sel;
          _this.queryInfo(_this.first_sel);
        } else {

          //默认获取第一个
          // _this.first_sel = _this.areaList.county_list;

        }
      })
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
        _this.userbindCompany = JSON.parse(localStorage.getItem('bwcList'))
        //设定默认值
        if (_this.userbindCompany[0]) {
          _this.first_sel = _this.userbindCompany[0].groupCode;
        } else {
          _this.first_sel = _this.companyData[0].groupCode;
        }
        _this.queryInfo(_this.first_sel);
      });
    },
    // 获取通知公告列表
    queryInfo(groupCode) {
      this.infoData = [];
      var _this = this;
      let params = { //接口入参
        "data": {
          "groupCode": groupCode
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/waterPrice', //接口地址
      }).then(res => {
        _this.infoData = res === null ? [] : res
      })
    },
    choice_company(value) {
      this.queryInfo(this.first_sel)
    },

  }
}

</script>

<style scoped lang="less">
.water-price-info {
  .search_content {
    // border:1px solid #000;
    //height: 2rem;
    // padding:1% 2%;
    // text-align: center;
    .search_sel {
      height: 100%;
      // border: none;
      font-size: 16px;
      width: 60%;
    }
  }

  .content-padded {
    margin: 0;
    height: 100%;
    .header-img{
      background: #232a9c;
      height: 5%;
      display: flex;
      align-items: center;
      padding: 0 3%;
      img{
        width: 25%;
      }
    }

    .content-body {
      height: 100%;

      .search_content {
        height: 10%;
        .koron_search {
          border-style: solid;
          border-color: #ccc8c8;
          border-width: 1px;
        }
      }

      .kr-img {
        // height: 90%;
        height: 100%;
        padding: 1% 1%;
        overflow-y: auto;
        // margin-top: 25px;
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
  }

  .kr-img {
    padding: 10px;
    padding-top: 0;
  }

  .item-inner {
    padding: 0 40% !important;
  }
}
</style>