<template>
  <div class="quality-report">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>水质报告</header-title>
    </page-header> -->
    <page-content>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- <myHeader title='title'></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="content-padded">
          <div class="row">
            <div class="col-100 kr-content">
              <div class="kr-content-div">
                <div class="kr-select">
                  <van-cell-group>
                    <van-field class="koron_search" right-icon="arrow" :value="groupName" label="选择地区" readonly size="large" placeholder="请选择水司区域" @click="showAddressChuang" />
                  </van-cell-group>
                </div>
                <div class="kr-koron"></div>
                <div class="kr-body" @touchmove="touchmove($event)" @scroll="scroll($event)">
                  <div class="kr-div-parent" v-if="reportData.length > 0">
                    <div style="width:100%;">
                      <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" finished-text="没有更多" @load="onLoadList">
                        <van-cell v-for="item in reportData" :key="item.id + item.id" @click="details(item)">
                          <div class="qr-father">
                            <div class="kr-shuizhi">
                              <img src="../../../static/img/shuizhi1.png" alt="">
                            </div>
                            <div class="kr-left">
                              <!-- item.type==1?"水质报告":"其他" -->
                              <span class="kr-title">{{item.type}}</span>
                              <span class="kr-date">{{item.time}}</span>
                              <p>{{item.title}}</p>
                            </div>
                            <div class="kr-right">
                              <icon icon="back"></icon>
                            </div>
                          </div>
                        </van-cell>
                      </van-list>
                    </div>
                  </div>
                  <div class="no-div" v-if="reportData.length == 0">
                    <div style="width:100%;">
                      暂无水质报告数据
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
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
    myHeader,headerThree
  },
  data() {
    return {
      newCityMap:{},
      newAreaMap:{},
      message:{
        title:"水质报告",
        span1:"足不出户",
        span2:"在家看水质报告",
        isShow: '',
      },
      title:'水质报告',
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      fastpay: require('../../../static/img/banner-pic.png'),
      comp: require('../../../static/images/form/i-form-name.png'),
      notePic: require('../../../static/images/home/modal.png'),
      reportData: [],
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
      areaList: {
      },
      userlist: {},
      groupName: "",
    }
  },
  mounted() {
    console.log(this.areaList);
    // this.queryCompanyMes();
    this.getArrList2();
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
      console.log(keyCode,this.groupCode,keyName);
      sessionStorage.setItem('keyCode',keyCode)
      sessionStorage.setItem('groupKeyCode',this.groupCode)
      sessionStorage.setItem('groupKeyName',this.groupName)
      this.relationShow = false
      //查询通告列表
      this.first_sel = this.groupCode;
      this.reportData = [];
      this.pageIndex = 1; // 页码
      this.upFinished = false; // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.queryReport(this.groupCode);
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
        if (_this.userbindCompany[0] && sessionStorage.getItem('groupKeyCode')==null) {
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
          _this.queryReport(_this.first_sel);
        } else {
          //默认获取第一个
          // _this.first_sel = _this.areaList.county_list;
          _this.queryReport(sessionStorage.getItem('groupKeyCode'));
          _this.groupName = sessionStorage.getItem('groupKeyName');
          _this.areaNum = sessionStorage.getItem('keyCode');
        }
      })
    },


    // 上拉加载请求方法
    onLoadList() {
      this.pageIndex++;
      this.queryReport(this.first_sel);
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
        _this.queryReport(_this.first_sel);
      });
    },
    choice_company(value) {
      this.reportData = [];
      this.queryReport(this.first_sel)
    },
    // 获取水质报告列表
    queryReport(groupCode) {
      this.groupCode = groupCode;
      var _this = this;
      let params = { //接口入参
        data: {
          page: _this.pageIndex,
          pageCount: _this.pageSize,
          groupCode: groupCode
        },
      }
      this.$api.fetch({
        params: params, //参数
        apiUrl: '/public/waterQualityList', //接口地址
      })
        // .then(res => {
        //   _this.reportData = res.list;

        // })
        .then(res => {
          const rows = res.list;
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
            _this.reportData = rows;
          } else {
            _this.reportData = _this.reportData.concat(rows);
          }

        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "获取资源列表异常{" + error + "}",
            type: "error"
          });
        })
        .finally(() => {
          _this.isDownLoading = false;
          _this.isUpLoading = false;
        });
    },
    details(item) {
      item.groupCode = this.groupCode
      this.$router.push({
        path: '/qualityDelate',
        query: item
      })
    },
  }
}

</script>

<style scoped lang="less">
.quality-report {
  .content-padded {
    margin: 0;
    height: 70%;

    .row {
      height: 100%;

      .kr-content {
        height: 100%;

        .kr-content-div {
          height: 100%;
          border: 1px solid #b7b8b7;
          .kr-select {
            height: 10%;
            border-bottom: 1px solid #b7b7b7;
            .van-cell--large {
              border-bottom: 1px solid #b7b7b7;
            }
            .koron_search {
            }
          }
          .kr-koron {
            height: 1%;
          }
          .kr-body {
            height: 88%;
            overflow-y: auto;
            // margin-top: 12px
          }
        }
      }
    }

    .list {
      margin: 0;
    }

    .kr-content {
      padding: 10px;

      .kr-content-div {
        box-shadow: 1px 1px 5px 1px #888;

        .kr-select {
          width: 100%;
          select {
            // width: 30%;
            height: 1.8rem;
            font-size: 16px;
            width: 60%;
            // border:0;
          }
        }
        .kr-div-parent {
          border: 1px solid #e6e6e6;
          border-bottom: 0;
          display: flex;
          width: 100%;
          padding: 0px 0px;
          padding-bottom: 0;

          // padding: 10px 10px;
          .van-cell {
            // padding: 1% 0;
            // border-bottom: 1px solid #b7b7b7;
          }

          .van-cell__value {
            display: flex;
            .qr-father {
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
            .kr-shuizhi {
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
              // padding: 3% 0 ;

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
  }
}
</style>
