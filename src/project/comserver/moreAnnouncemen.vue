<template>
  <div class="more-announcemen">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>通知公告</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!-- <myHeader :title='title'></myHeader> -->
          <!-- <headerThree :message='message'></headerThree> -->
          <div class="kr-body">
            <div class="kr-containt">
              <div class="kr-koron"></div>
              <div class="kr-search_div" @touchmove="touchmove($event)" @scroll="scroll($event)">
                <div class="kr-div-parent" v-if="noteData.length > 0">
                  <div style="width:100%">
                    <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" finished-text="没有更多" @load="onLoadList">
                      <van-cell>
                        <div class="yh-tongzhi no-kongge">
                          <div class="yh-father yh-top-title">
                            <div class="yh-slot"></div>
                            <span class="yh-title yh-left">{{message.title}}</span>
                            <span></span>
                          </div>
                          <div v-if="noteData.length !== 0">
                            <div class="yh-father" v-for="(item,i) in noteData" :key='i' @click="details(item)">
                              <div class="yh-left">
                                <div class="yh-left-top">
                                  <!-- <span class="yh-left-zd" v-if="i<3">置顶</span> -->
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
                        </div>
                      </van-cell>
                    </van-list>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </div>
    </page-content>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
  </div>
</template>

<script>
import { PullRefresh } from 'vant';
import myHeader from "@/comments/myHeader";
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      newCityMap:{},
      newAreaMap:{},
      message: {
        title: "",
        span1: "足不出户",
        span2: "在家看通知详情",
        isShow: '',
      },
      title: '',
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      comp: require("@/project/assets/images/form/i-form-name.png"),
      noteData: [],
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

      apiUrl: '',//请求路径
    };
  },
  created() {
    console.log(this.$route.query);
    // setTimeout(() => {
    this.apiUrl = this.$route.query.path;
    this.groupCode = this.$route.query.groupCode;
    this.message.title = this.$route.query.title;
    if (this.message.title == '0') {
      this.message.title = '停水通知'
    } else if (this.message.title == '1') {
      this.message.title = '公告'
    } else if (this.message.title == '2') {
      this.message.title = '新闻'
    }
    this.$set(this.message, 'title', this.message.title)
    $('#myTitle').html(this.message.title)
    console.log(this.message.title);
    // }, 10);
  },
  mounted() {
    // this.queryCompanyMes();
    // this.getArrList2();

    this.queryNote(this.groupCode,this.apiUrl);
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
      console.log(keyCode, this.groupCode, keyName);
      sessionStorage.setItem('keyCode', keyCode)
      sessionStorage.setItem('groupKeyCode', this.groupCode)
      sessionStorage.setItem('groupKeyName', this.groupName)
      this.relationShow = false
      //查询通告列表
      this.first_sel = this.groupCode;
      this.noteData = [];
      this.pageIndex = 1; // 页码
      this.upFinished = false; // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.queryNote(this.groupCode, this.apiUrl);
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
        if (_this.userbindCompany[0] && sessionStorage.getItem('groupKeyCode') == null) {
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
          _this.queryNote(_this.first_sel, _this.apiUrl);
        } else {

          //默认获取第一个
          // _this.first_sel = _this.areaList.county_list;
          _this.queryNote(sessionStorage.getItem('groupKeyCode'), _this.apiUrl);
          _this.groupName = sessionStorage.getItem('groupKeyName');
          _this.areaNum = sessionStorage.getItem('keyCode');
        }
      })
    },

    // 上拉加载请求方法
    onLoadList() {
      this.pageIndex++;
      this.queryNote(this.first_sel, this.apiUrl);
      // this.queryNote(sessionStorage.getItem('groupKeyCode'),this.apiUrl)
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
          _this.queryNote(_this.first_sel, _this.apiUrl);
        });
    },
    // 获取通知公告列表
    queryNote(groupCode, url) {
      // console.log(groupCode);
      var _this = this;
      // this.groupCode = groupCode;
      let params = {
        //接口入参
        data: {
          page: _this.pageIndex,
          pageCount: _this.pageSize,
          // groupCode: groupCode
          groupCode:_this.groupCode,
          type:_this.$route.query.type,
        }
      };
      this.$api
        .fetch({
          params: params, //参数
          // apiUrl: "/public/infoList" //接口地址
          apiUrl: url,
        })
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
      this.queryNote(this.first_sel, this.apiUrl);
    },
    details(item) {
      // item.groupCode = this.groupCode;
      // this.$router.push({
      //   path: "/infoDetail",
      //   query: item
      // });
      item.groupCode = this.groupCode;
      this.getInfoDetail(item);
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
        if (res.url !== null) {
          window.location.href = res.url;
        } else {
          let query = {};
          query.res = res
          query.title = _this.message.title;
          query.groupCode = _this.groupCode;
          query.id = item.id;
          console.log(query)
          this.$router.push({
            path: "/infoDetail",
            // query: res
            query: query,
          });
        }
      })
    },
  }
};

</script>

<style scoped lang="less">
.more-announcemen {
  height: 100%;

  .page-content {
    height: 100%;

    .content-padded {
      height: 100%;

      .kr-body {
        // height: 72%;
        height: 100%;

        .kr-containt {
          height: 100%;
          // border: 1px solid #b7b7b7;

          .search_content {
            height: 10%;
            line-height: 1;
            border-bottom: 1px solid #b7b7b7;
            .van-cell--large {
              border-bottom: 1px solid #b7b7b7;
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
          .kr-koron {
            // height: 2%;
          }
          .kr-search_div {
            height: 98%;
            overflow-y: auto;
            .van-cell {
              // border-bottom: 1px solid #b7b7b7;
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

          // padding: 10px 10px;
          .van-cell {
            // padding: 8px 0px 5px 0px;
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
  .yh-tongzhi {
    margin-top: 3%;
    padding: 0 3%;
    background: #fff;
    width:100%;
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
      justify-content: flex-start;
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
}
</style>
