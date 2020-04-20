<template>
  <div class="billRead">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账单预览</header-title>
    </page-header> -->
    <page-content>
      <div class="billRead-conent">
        <!-- @click="takeImage()" -->
        <div class="billRead-img">
          <img :src="'data:image/png;base64,'+readImg" alt="">
        </div>
        <!-- <van-image-preview v-model="show" :images="images" @change="onChange">
          <template v-slot:index>第{{ index }}页</template>
        </van-image-preview> -->
        <div class="billRead-btn">
          <div class="billRead-btn-left">
            <m-button size="large" icon="back" @click.native="billUpLoad()">
              账单下载
            </m-button>
          </div>
          <div class="billRead-btn-right">
            <m-button size="large" icon="back" @click.native="sendEmail()">
              发送邮件
            </m-button>
          </div>
        </div>
      </div>
      <van-dialog class="dialog" id="kr-dialog" v-model="emailShow" :beforeClose="beforeClose" title="发送邮件" show-cancel-button>
        <van-field v-model="email" placeholder="请输入邮箱名" oninput="this.value=this.value.replace(/[^0-9.@a-zA-Z]+/,'');" @blur="emailTest()" />
      </van-dialog>
    </page-content>
  </div>
</template>
<script>
// import pdf from 'vue-pdf'
import headerTwo from '@/comments/headerTwo';
import axios from 'axios'
import { Dialog, Field, Toast, PullRefresh, List, ImagePreview } from 'vant';
export default {
  components: {
    headerTwo
  },
  data() {
    return {
      message:{
        title:"账单预览",
      },
      emailShow: false,
      email: '',
      readImg: '',
      goUrl: '',
      //图片预览
      show: false,
      index: 0,
      images: []
    }
  },
  mounted() {
    $('#myTitle').html(this.message.title)
    // this.readImg = pdf.createLoadingTask(this.readImg)
    this.goUrl = location.href.split('#')[0] + '#/billDown';
    this.init()
  },
  methods: {
    init() {
      let _this = this;
      let groupCode = localStorage.getItem('groupCode');
      let userNo = localStorage.getItem('userNo');
      let billMonth = _this.$route.query.billMonth;
      let params = {//接口入参
        data: {
          groupCode,
          userNo,
          billMonth,
        }
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/getBillPdf',//接口地址
      }).then(res => {
        _this.readImg = res[0];
        _this.images.push(_this.readImg)
        // this.dataURLtoBlob(res);
      })
    },
    sendEmail() {//发送邮件
      let _this = this;
      let groupCode = localStorage.getItem('groupCode');
      let userNo = localStorage.getItem('userNo');
      let params = {//接口入参
        "data": {
          groupCode,
          userNo,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/emailQuery',//接口地址
      }).then(res => {
        _this.emailShow = true
        _this.email = res
      })
    },
    billUpLoad() {//账单下载
      let item = {
        url: '',
      }
      // this.goUrl+
      item.url = "?groupCode=" + localStorage.getItem('groupCode') + '&userNo='
        + localStorage.getItem('userNo') + '&billMonth=' + this.$route.query.billMonth;
      // window.location.href = window.location.protocol + "//" + window.location.host + '/wxcss2/#/download?url=‘http://testwt.gdhwater.com/wxcss2/myWater/billDownload' + item.url//赤壁水司
      // window.location.href = window.location.protocol + "//" + window.location.host + '/wxcss2/#/download?url=‘http://wx.chibisw.cn/wxcss2/myWater/billDownload' + item.url//赤壁水司
      window.location.href = window.location.protocol + "//" + window.location.host + '/wxcss2/#/download?url=' + window.location.protocol + "//" + window.location.host + '/wxcss2/myWater/billDownload' + item.url
    },
    emailTest() {
      let that = this;
      console.log(that.email);
      let message = '';
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (that.email == '' || that.email == null) {
        message = '邮箱编号不能为空。';
        Toast.fail(message);
        return
      } else if (!reg.test(that.email)) {
        message = '邮箱编号类型错误。';
        Toast.fail(message);
        return
      }
    },
    beforeClose(action, done) {
      event.stopPropagation();
      let _this = this;
      if (action == 'confirm') {
        // _this.emailTest();
        let message = '';
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (_this.email == '' || _this.email == null) {
          message = '邮箱编号不能为空。';
          Toast.fail(message);
          // 关闭弹框
          done()
          // _this.appendChild()
        } else if (!reg.test(_this.email)) {
          message = '邮箱编号格式不正确。';
          Toast.fail(message);
          // 关闭弹框
          done()
          // _this.appendChild()
        } else {
          let groupCode = localStorage.getItem('groupCode');
          let userNo = localStorage.getItem('userNo');
          let billMonth = _this.$route.query.billMonth;
          let params = {//接口入参
            data: {
              groupCode,
              userNo,
              billMonth,
              email: _this.email,
            }
          }
          console.log(params);
          _this.$api.fetch({
            params,//参数
            apiUrl: '/myWater/billEmail',//接口地址
          }).then(res => {
            Toast.success('账单已成功发送至您邮箱，请稍后查看')
          })
          // 关闭弹框
          done()
        }
      } else if (action == 'cancel') {
        // 关闭弹框
        done()
      }
    },
    //base64 转换 blob
    dataURLtoBlob(dataurl) {
      var bstr = atob(dataurl)
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: 'pdf' });
    },
    //图片预览
    onChange(index) {
      this.index = index;
    },
    takeImage(){
      this.show = true;
    }
  }
}
</script>

<style scoped lang="less">
.billRead {
  height: 100%;
  .billRead-conent {
    padding: 1% 2%;
    height: 100%;
    .billRead-img {
      height: 90%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .billRead-btn {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: space-between;
      .billRead-btn-left {
        width: 48%;
      }
      .billRead-btn-right {
        width: 48%;
        .button {
          background: #ed702d;
        }
      }
    }
  }
}
</style>