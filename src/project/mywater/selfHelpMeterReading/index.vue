<template>
  <div class="selfHelpMeterReading" v-if="selfHelpShow">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>自助抄表</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title="title" class="myheader"></myHeader> -->
        <div class="yh-myheader">
          <img src="../../../../static/img/zizhucb.png" alt="">
        </div>
        <div class="row bottom_content">
          <div class="col-100">
            <div class="kr-body">
              <div class="kr-body-info">
                <div class="kr-containt">
                  <div class="kr-div">
                    <van-field class="yh-my-blue" left-icon="location-o" v-model="tableData.groupArea" label="所属地区" readonly placeholder="" size="large" />
                  </div>
                  <div class="kr-div">
                    <van-field class="yh-my-red" left-icon="label-o" v-model="tableData.userNo" label="水表编号" readonly placeholder="" size="large" />
                  </div>
                  <div class="kr-div">
                    <van-field class="yh-my-blue" left-icon="user-o" v-model="tableData.userName" label="用户名称" readonly placeholder="" size="large" />
                  </div>
                  <div class="kr-div">
                    <van-field class="yh-my-red" left-icon="underway-o" v-model="tableData.lastReadDate" label="上次抄表日期" readonly placeholder="" size="large" />
                  </div>
                  <div class="kr-div kr-title">
                    <van-field class="yh-my-blue" left-icon="orders-o" v-model="tableData.lastReadNum" label="上次抄表读数" readonly placeholder="" size="large" />
                  </div>
                  <div class="kr-div kr-flex">
                    <!-- :disabled="isEdit" readonly-->
                    <van-field class="yh-my-red kr-right kr-title" :readonly='isEdit' @blur="blurTest" left-icon="new-o" v-model="tableData.value" oninput="this.value=this.value.replace(/[^0-9]+/,'');" label="当前读数" placeholder="输入当前读数" size="large" />
                    <span class="kr-left kr-m3">m³</span>
                    <!-- <div class="kr-left">
                      <div @click="howRead(1)">如何抄读</div>
                    </div> -->
                  </div>
                  <div class="kr-div kr-addPic">
                    <van-field class="yh-my-blue" left-icon="photo-o" label="添加图片" :disabled="isEdit" readonly size="large" />
                    <div class="kr-left">
                      <div @click="howRead(2)">如何拍照</div>
                    </div>
                  </div>
                  <div class="kr-div kr-flex">
                    <van-uploader class="kr-right" v-model="fileList" readonly multiple :max-count="3" :disabled="isEdit"/>
                  </div>
                </div>
              </div>
            </div>
            <!-- 水表编号 -->
            <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
              <van-picker class="timepicker" show-toolbar title="水表编号" :columns="meterReadingColumns" @cancel="onCancelRelation" @confirm="onConfirmRelation" />
            </van-popup>
            <p class="form-button">
              <m-button size="large" @click.native="getFtoken" :disabled="isEdit" class="kr-btn" id="btn" style="display: inline-block;width: 93%;font-family: PingFang_Medium;font-size: 20px;background: #479EFF; color: #fff;">
                确定
              </m-button>
            </p>
          </div>
        </div>
        <!-- <span class="User-guide" @click="checkFile()">查看自助抄表用户指南</span> -->
        <!-- </van-pull-refresh> -->
      </div>
    </page-content>
  </div>
  <notFound v-else></notFound>
</template>

<script>
import myHeader from '@/comments/myHeader'
import notFound from '@/project/mywater/notFound'
import { Toast, PullRefresh, Dialog } from 'vant';
import axios from 'axios'
export default {
  components: {
    myHeader, notFound
  },
  data() {
    return {
      isReadOnly:false,//后端返回错误code 10017 页面只读
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      selfHelpShow: true,
      title: '自助抄表',
      relationShow: false,
      arrListName: [],
      arrListCode: [],
      tableData: {
        userNo: '',
        groupArea: '',
        userName: '',
        groupCode: '',
        lastReadDate: '',
        lastReadNum: '',
      },
      meterReadingData: [],
      meterReadingColumns: [],
      fileList: [],
      ftoken: '',
      fileUrlList: [],
      emailURL: '',
      // 是否可编辑（智能水表无需编辑）false表示可以编辑
      isEdit: false,
      // 当前时间
      toDay: '',
    }
  },
  mounted() {
    this.$store.state.notFound = 4;
    // 获取当前时间
    // var day = new Date();
    // day.setTime(day.getTime());
    // this.toDay = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

    this.emailURL = URLurl;
    // this.getWaterNum()
    if (this.$route.query.userNo == undefined) {
      this.tableData.groupArea = this.$store.state.meterReadingAccount[0].groupArea;
      this.tableData.userName = this.$store.state.meterReadingAccount[0].userName;
      this.tableData.groupCode = this.$store.state.meterReadingAccount[0].groupCode;
      this.tableData.userNo = this.$store.state.meterReadingAccount[0].userNo;
      this.tableData.lastReadNum = this.$store.state.meterReadingAccount[0].lastReadNum + 'm³';
      this.tableData.lastReadDate = this.$store.state.meterReadingAccount[0].lastReadDate;
      this.getValue(this.tableData.userNo, this.tableData.groupCode)
    } else {
      this.tableData = this.$route.query
      this.getValue(this.tableData.userNo, this.tableData.groupCode)
    }
    console.log(this.tableData);
  },
  methods: {
    howRead(num) {
      if(this.isReadOnly){
        return
      }
      if (num == 1) {
        this.$router.push({ path: '/userGuide' })
      } else if (num == 2) {
        this.$router.push({ path: '/userGuideTwo' })
      }

    },
    blurTest(){//抄表读数的效验
      if(this.isEdit){
        return
      }
      if(parseFloat(this.tableData.value)<parseFloat(this.tableData.lastReadNum.slice(0,this.tableData.lastReadNum.length-2))){
        Toast('当前读数应大于上次抄表读数');
        return
      }
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
        this.emailURL = URLurl;
        this.getWaterNum()
      }, 500);
    },

    getWaterNum() {
      let _this = this
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
        }
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/selfUserList',//接口地址
      }).then(res => {
        if (res.length == 0) {
          _this.selfHelpShow = false;
        } else {
          _this.meterReadingData = []
          _this.meterReadingData = res
          _this.meterReadingColumns = _this.meterReadingData.map(item => item.userNo)
          this.selfHelpShow = true;
        }
      })
    },
    // 获取近期读数
    getValue(userNo, groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "userNo": userNo
        },
      }
      this.$api.fetch({
        params: params,
        apiUrl: '/myWater/selfCheckQuery',
      }).then(res => {
        _this.tableData.lastReadDate = res.lastReadDate
        _this.tableData.threePhaseAvg = res.threePhaseAvg
        _this.tableData.beginReadDate = res.beginReadDate
        _this.tableData.endReadDate = res.endReadDate
        // 上次抄表读数为null时数据处理
        if (res.lastReadNum !== null) {
          _this.tableData.lastReadNum = res.lastReadNum + 'm³'
        } else {
          _this.tableData.lastReadNum = 'm³'
        }

        // 判断null
        if (!res && typeof (res) != "undefined" && res != 0) {
          _this.tableData.value = ''
          _this.fileList = []
        } else {
          if(res.value !== '' && res.value !== null){
            _this.$set(_this.tableData,'value',parseInt(res.value))
          }
          if (!res.pic && typeof (res.pic) != "undefined" && res.pic != 0) {
            _this.fileList = []
          } else {
            _this.fileList = []
            for (let i = 0; i < res.pic.length; i++) {
              _this.fileList.push({ url: res.pic[i] })
            }
          }
        }


        if (res.isAIMeter == 1) {
          Toast('您的水表具备自动抄表能力，无需人工抄表');
          _this.isEdit = true
          $('.kr-btn').css('background', 'gray')
        }
      }).catch(res=>{
        console.log(res.code)
        if(res.code == 10017){
          _this.isReadOnly = true;
          _this.isEdit = true;
          $('#btn').css({
            display:'none',
          })
        }
      })
    },
    // 获取ftoken
    getFtoken() {
      var _this = this;
      console.log(this.tableData.lastReadNum!==undefined)
      if(parseFloat(this.tableData.value)<parseFloat(this.tableData.lastReadNum.slice(0,this.tableData.lastReadNum.length-2))){
        Toast('当前读数应大于上次抄表读数');
        return
      }
      // 智能水表无需手动抄表
      if (this.isEdit == true)
        return

      if (!_this.isDuringDate(_this.tableData.beginReadDate, _this.tableData.endReadDate)) {
        Toast('请您'+ _this.tableData.beginReadDate+ '至' + _this.tableData.endReadDate + '期间进行抄表');
        return
      }

      // 当前读数偏大，给用户设二次确认框
      if (_this.tableData.value - _this.tableData.lastReadNum.replace('m³', "") > _this.tableData.threePhaseAvg) {
        Dialog.confirm({
          // title: '警告',
          message: '当前读数偏大，是否继续保存？'
        }).then(() => {
          let params = {//接口入参
            "data": {},
          }
          _this.$api.fetch({
            params: params,
            apiUrl: '/file/getFtoken',
          }).then(res => {
            _this.ftoken = res.ftoken
            // 若没有添加新图片，则不进入getImgUrl()（调不到submit()），该变量用于判断没有修改及删除部分图片后能调submit()
            var goSubmit = 0
            for (let i = 0; i < _this.fileList.length; i++) {
              if ('url' in _this.fileList[i]) {
                _this.fileUrlList.push(_this.fileList[i].url)
                goSubmit++
              } else {
                _this.getImgUrl(_this.fileList[i].file, i)
              }
            }
            if (goSubmit == _this.fileList.length) {
              _this.submit()
            }
          })
        }).catch(() => {
          return
        });
      } else {
        let params = {//接口入参
            "data": {},
          }
          _this.$api.fetch({
            params: params,
            apiUrl: '/file/getFtoken',
          }).then(res => {
            _this.ftoken = res.ftoken
            // 若没有添加新图片，则不进入getImgUrl()（调不到submit()），该变量用于判断没有修改及删除部分图片后能调submit()
            var goSubmit = 0
            for (let i = 0; i < _this.fileList.length; i++) {
              if ('url' in _this.fileList[i]) {
                _this.fileUrlList.push(_this.fileList[i].url)
                goSubmit++
              } else {
                _this.getImgUrl(_this.fileList[i].file, i)
              }
            }
            if (goSubmit == _this.fileList.length) {
              _this.submit()
            }
          })
      }

    },
    // 获取图片地址
    getImgUrl(item, i) {
      console.log(item);

      var _this = this;
      let $formData = new FormData();
      $formData.append('file', item);
      $formData.append('ftoken', this.ftoken);
      // 产生跨域问题，用降级浏览器测试
      // 需要同时调不同服务器的接口，所以该接口用原生写
      let RequestObj = {
        // url: 'http://10.13.1.248:10041/fileService/imgStrUpload',//公司
        // url: 'http://219.139.169.234:9992/fileService/imgStrUpload',//赤壁水司
        url: _this.emailURL,
        method: 'post',
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: $formData
      };
      axios(RequestObj).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            _this.fileUrlList.push(res.data.data.path)
            if (_this.fileUrlList.length == _this.fileList.length) {
              _this.submit()
            }
          }
        }
      }, err => {

      }).catch(error => {

      })
    },
    submit() {
      let _this = this
      if (this.tableData.value == '') {
        Toast.fail('请将水表读数填写正确');
        return
      }
      if (_this.fileUrlList.length == 0) {
        Toast.fail('请至少上传一张图片');
        return
      }
      let params = {
        "data": {
          "userNo": this.tableData.userNo,
          "groupCode": this.tableData.groupCode,
          "value": Number(this.tableData.value),
          "pic": _this.fileUrlList,
          'openId':localStorage.getItem('openId'),

          'userName': this.tableData.userName,
          'lastReadDate': this.tableData.lastReadDate,
          'lastReadNum': this.tableData.lastReadNum.replace('m³', ''),
          'threePhaseAvg': this.tableData.threePhaseAvg
        }
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/selfCheckAdd',//接口地址
      }).then(res => {
        Toast.success('抄表成功，感谢您的支持！');
        setTimeout(() => {
          _this.fileUrlList = []
        }, 2000);
        // _this.tableData = {};
        // _this.fileList = [];
      })
    },
    // 先遍历图片获取url，然后调提交接口
    getImgUrlAndSubmit() {

    },
    //水表编号遮罩层
    selectRelation() {
      this.relationShow = true;
    },
    // 水表编号返回按钮
    onCancelRelation() {
      this.relationShow = false;
    },
    // 水表编号遮罩层确定按钮  
    onConfirmRelation(value, index) {
      this.tableData.userNo = value
      for (let i = 0; i < this.meterReadingData.length; i++) {
        if (this.meterReadingData[i].userNo == this.tableData.userNo) {
          this.tableData.groupCode = this.meterReadingData[i].groupCode
        }

      }
      this.getValue(this.tableData.userNo, this.tableData.groupCode)
      this.relationShow = false;
    },
    // 判断当前时间是否属于抄表时间内方法
    isDuringDate(begin, end) {
      var toDay = new Date()
      var beginDate = new Date(begin)
      var endDate = new Date(end)
      console.log(beginDate);
      console.log(endDate);
      console.log(toDay >= beginDate && toDay <= endDate);
      if (toDay >= beginDate && toDay <= endDate) {
        return true
      } else {
        return false
      }
    }
  },
}
</script>

<style scoped lang="less">
.selfHelpMeterReading {
  .kr-flex .van-field__control {
    color: #323232 !important;
  }
  .van-field__label {
    width: 120px;
  }
  .User-guide {
    position: fixed;
    bottom: 10px;
    left: 10px;
    color: #3193f6;
    padding: 2px;
    font-size: 16px;
    border-bottom: 1px solid #3193f6;
  }
  .myheader {
    // height: auto;
    height: 9rem;
    // padding: 0 0 5% 0 !important;
  }
  .van-uploader__upload {
    border: 2px dashed #4da1ff;
    border-radius: 10px;
  }
  .icon {
    transform: rotate(90deg);
    display: inline-block;
  }
  .form-button {
    text-align: center;
    width: 100%;
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
    // margin: 0px 0px 10px 0px;
    .col-100 {
      width: 94%;
      padding: 2% 0;
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
    .yh-myheader {
      // height: 9rem;
      // padding: 1% 3%;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .van-cell--large {
    padding: 10px 0;
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
      // padding: 10px 10px;
      .kr-body-info {
        // box-shadow: 1px 1px 5px 1px #888;
        .kr-containt {
          padding: 0 2%;
          .kr-div {
            border-bottom: 1px solid #ebebeb;
            padding: 0px 10px;
            font-weight: 300;
            font-size: 15px;
            .kr-name {
              display: inline-block;
              width: 30%;
              // font-family: PingFang_Bold;
              font-weight: 600;
            }
            .kr-title {
              color: #000;
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
          .kr-flex {
            display: flex;
            width: 100%;
            .kr-title {
              .van-cell__title {
                span {
                  font-weight: bold;
                }
              }
            }
            .kr-left {
              width: 20%;
              text-align: center;
              div {
                background: #ed702d;
                color: #fff;
                // padding: 1% 1%;
                padding: 2% 2%;
                border-radius: 5px;
              }
            }
            .kr-m3 {
              width: 10%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .kr-addPic {
            border: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .van-field {
              width: 80%;
            }
            .kr-left {
              width: 20%;
              text-align: center;
              div {
                background: #ed702d;
                color: #fff;
                // padding: 1% 1%;
                padding: 2% 2%;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>