 <template>
  <div class="waterInformation">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>未绑定用户</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title='title'></myHeader> -->
        <headerThree :message = 'message'></headerThree>

        <div class="yh-body">
          <div class="yh-conent" v-for="item in waterData" :key='item.groupCode'>
            <div @click="getWaterUrl(item.groupCode)" class="yh-div02">
              <div class="yh-title">{{item.groupFullName}}</div>
            </div>
          </div>
        </div>

      </div>
    </page-content>
    <!-- 所属地区 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" />
    </van-popup>
  </div>
</template>

<script>
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
        title:"粤海水务",
        span1:"足不出户",
        span2:"在家看粤海水务",
        isShow: '',
      },
      isShow: 1,
      // title:"请绑定用户",
      title: '粤海水务',
      tableData: {},
      waterData: [],
      
      // 所属地区
      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
    }
  },
  mounted() {
    // this.getArrList2()
    this.getWater()
  },
  methods: {
    getWaterUrl(groupCode) {
      let _this = this
      let params = {
        "data": {
          groupCode: groupCode
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/waterInfo',//接口地址
      }).then(res => {
        window.location.href = res
      })
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      // console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.tableData.groupCode = val[1].code.slice(2)
        this.tableData.groupName = val[0].name + val[1].name
      } else {
        this.tableData.groupCode = val[2].code.slice(4);
        this.tableData.groupName = val[0].name + val[1].name + val[2].name
      }
      this.tableData.groupCode = this.common.codeTransCity(this.tableData.groupCode,this.newCityMap);
      // this.tableData.groupCode = this.common.codeTrans(this.tableData.groupCode,this.newAreaMap)
      this.tableData.groupName = this.tableData.groupName.replace('*', '')
      // console.log(this.tableData.groupCode);
      this.relationShow = false
      this.getWaterUrl()
    },
    // 三级联动点击取消按钮事件
    exit() {
      this.relationShow = false
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
        // _this.waterColumns = _this.waterData.map(item => item.groupFullName)
      })
    },
    // 获取所属地区数据
    getArrList2() {
      let _this = this
      let params = {
        "data": {
          openId:localStorage.getItem('openId'),
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
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        
      })
    },
    // 点击展示地址弹窗
    showAddressChuang() {
      if (this.isReadyonly) {
        return
      }
      this.relationShow = true
    },
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
.waterInformation {
  .yh-body{
    height: 70%;
    padding: 5% 8%;
    .yh-conent{
      height: 13%;
      width: 100%;
      display: flex;
      flex-direction: row;
      box-shadow: 1px 1px 5px 1px #888888;
      margin-top:5%;
      border-radius: 5px;
      .yh-div01{
        width:25%;
        background: #12377e;
        // display: table-cell;
        // vertical-align: middle;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content:center;
        align-items :center;
        // margin:0 auto;
        img{
          width: 35%;
          color:#fff;
          // margin: 0 auto;
        }
      }
      .yh-div02{
        width: 100%;
        line-height:100%;
        height: 100%;
        // padding:2% 0% 2% 8%;
        display:flex;
        flex-direction: column;
        justify-content:space-around;
        // div{
        //   padding:4% 0 0 10%;
        // }
        .yh-title{
          // font-weight: 600;
          font-weight: bolder;
          font-size: 16px;
          text-align: center;
          color: #297ACC;
        }
        .yh-remark{
          font-size:16px;
          font-weight: 100;
        }
      }
    }
  }
  .span_content {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid #dcdcdc;
  }
  .content-padded {
    height: 100%;
    margin: 0;
    .kr-body {
      padding: 10% 5%;
      height: 70%;
      // margin-top:10%;
      .kr-containt {
        box-shadow: 0px 1px 9px -1px #888;
        .kr-top {
          padding: 16px 10px 0 10px;
          text-align: center;
          img {
            width: 100px;
          }
        }
        .kr-middle {
          padding: 10px 0px 10px 5%;
          p {
            font-size: 16px;
          }
        }
        .kr-buttom {
          .button {
            height: 60px;
            line-height: 60px;
            border-radius: 0;
            // font-family: PingFang_Medium;
            font-size: 18px;
          }
          .button-danger {
            background: #ed702d;
          }
          .button-success {
            background: #49cc7c;
          }
        }
      }
    }
    .add_box {
      position: absolute;
      width: 100%;
      top: 26%;
      height: 10%;
      padding: 0px 5px;
    }
  }
  .row {
    margin-left: 0;
  }
  .col-100 {
    .midle-bar {
      padding: 0 0 0 15px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      b {
        font-size: 20px;
        line-height: 40px;
      }
    }
    .list {
      .item-media {
        margin-right: 10px;
        width: 20%;
        .pay-button {
          font-size: 18px;
          background: blue;
          height: 100%;
          width: 100%;
        }
      }
      .item-content {
        .item-title {
          height: 1.6rem;
          line-height: 1.6rem;
          img {
            position: relative;
            top: 0.2rem;
          }
        }
      }
    }
  }
}
</style>