 <template>
  <div class="upload">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>上传附件</header-title>
    </page-header> -->
    <page-content>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content-padded">
          <!-- <myHeader :title="title"></myHeader> -->
          <headerThree :message = 'message'></headerThree>
          <div class="row">
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'company'">工商营业执照<span style="color: red">*</span></div>
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'people'">房产证<span style="color: red">*</span></div>
            <van-uploader v-model="fileList1" multiple :max-count="1" :after-read="afterRead1" />
          </div>
          <div class="row">
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'company'">法人身份证正面<span style="color: red">*</span></div>
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'people'">居民身份证正面<span style="color: red">*</span></div>
            <van-uploader v-model="fileList2" multiple :max-count="1" :after-read="afterRead2" />
          </div>
          <div class="row" style="margin-bottom: 20%;">
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'company'">法人身份证反面<span style="color: red">*</span></div>
            <div class="upLoad_title" v-if="upLoadNeedData.type == 'people'">居民身份证反面<span style="color: red">*</span></div>
            <van-uploader v-model="fileList3" multiple :max-count="1" :after-read="afterRead2" />
          </div>
          <!-- <div class="btn_box">
            <a @click="submit" v-if="upLoadNeedData.isModify != 0">
              <m-button size="large">提交</m-button>
            </a>
            <a @click="goBack">
              <m-button size="large" style="float: left;margin-left: 12%">上一步</m-button>
            </a>
            <a @click="goNext">
              <m-button size="large">下一步</m-button>
            </a>
          </div> -->
        </div>
      </van-pull-refresh>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import { Toast, PullRefresh } from 'vant';
export default {
  components: {
    myHeader,headerThree,
  },
  props: ['upLoadNeedData'],
  data() {
    return {
      message:{
        title:"上传附件",
        span1:"足不出户",
        span2:"在家看上传附件",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: '上传附件',
      fileList1: [],
      fileList2: [],
      fileList3: [],
      base64Data: [],
    }
  },

  mounted() {
    console.log(1111111);
    console.log(this.upLoadNeedData);
    if (this.upLoadNeedData.isModify != 2) {
      console.log(this.upLoadNeedData.isModify);
      this.fileList1.push({ url: this.upLoadNeedData.fileList[0] })
      this.fileList2.push({ url: this.upLoadNeedData.fileList[1] })
      this.fileList3.push({ url: this.upLoadNeedData.fileList[2] })
    }
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
        if (this.upLoadNeedData.isModify != 2) {
          console.log(this.upLoadNeedData.isModify);
          this.fileList1.push({ url: this.upLoadNeedData.fileList[0] })
          this.fileList2.push({ url: this.upLoadNeedData.fileList[1] })
          this.fileList3.push({ url: this.upLoadNeedData.fileList[2] })
        }
      }, 500);
    },
    afterRead1(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    afterRead2(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    // 上一步按钮
    goBack() {
      if (this.upLoadNeedData.type == 'people') {
        this.$parent.peopleApplyShow = true
        this.$parent.upLoadShow = false
        this.$parent.otherInformationShow = false
      } else {
        this.$parent.compApplyShow = true
        this.$parent.upLoadShow = false
        this.$parent.otherInformationShow = false
      }
    },
    // 下一步按钮
    goNext() {
      if (this.upLoadNeedData.type == 'people') {
        this.$parent.peopleApplyShow = false
        this.$parent.upLoadShow = false
        this.$parent.otherInformationShow = true
      } else {
        this.$parent.compApplyShow = false
        this.$parent.upLoadShow = false
        this.$parent.otherInfomationShow = true
      }
    },
    // 提交按钮
    submit() {
      var item = [];
      if (this.fileList1.length > 0 && this.fileList2.length > 0 && this.fileList3.length > 0) {
        //执照/房产证
        // var reader = new FileReader();
        // reader.readAsDataURL(this.fileList1[0].file);
        // reader.onload = function () {
        //   var arr = reader.result.split(",")
        //   item.push(arr[1])
        // };

        // console.log(this.fileList1[0].content.split(",")[1]);
        // var arr = this.fileList1[0].content.split(",")
        if ('url' in this.fileList1[0]) {// 未修改图片
          item.push(this.fileList1[0].url) // 原图片路径
        } else {// 修改了图片
          item.push(this.fileList1[0].content.split(",")[1]) // base64转码
        }

        if ('url' in this.fileList2[0]) {// 未修改图片
          item.push(this.fileList2[0].url) // 原图片路径
        } else {// 修改了图片
          item.push(this.fileList2[0].content.split(",")[1]) // base64转码
        }

        if ('url' in this.fileList3[0]) {// 未修改图片
          item.push(this.fileList3[0].url) // 原图片路径
        } else {// 修改了图片
          item.push(this.fileList3[0].content.split(",")[1]) // base64转码
        }

        // item.push(this.fileList2[0].content.split(",")[1])
        // item.push(this.fileList3[0].content.split(",")[1])

        // //身份证正面
        // var reader1 = new FileReader();
        // reader1.readAsDataURL(this.fileList2[0].file);
        // reader1.onload = function () {
        //   var arr = reader.result.split(",")
        //   item.push(arr[1])
        // };
        // //身份证反面
        // var reader3 = new FileReader();
        // reader3.readAsDataURL(this.fileList3[0].file);
        // reader3.onload = function () {
        //   var arr = reader.result.split(",")
        //   item.push(arr[1])
        // };
      } else {
        Toast.fail('请选择三张图片后再提交');
        return
      }


      if (this.upLoadNeedData.type == 'people') {
        this.BUS.$emit('fileList1', item)
      } else {
        this.BUS.$emit('fileList2', item)
      }
    },
  },
}
</script>

<style scoped lang="less">
.upload {
  .van-uploader {
    width: 100%;
    .van-uploader__upload {
      margin: 0 auto;
    }
  }
  .page-content {
    background-color: #f7f8fa;
  }
  .btn_box {
    width: 100%;
    position: fixed;
    bottom: 3%;
    right: 7%;
    .button {
      font-size: 15px;
      // font-family: PingFang_Regular;
      font-weight: 300;
      height: 1.5rem;
      line-height: 1.5rem;
      width: 19%;
      float: right;
      // background: #479EFF;
    }
  }

  .upLoad_title {
    height: 2rem;
    line-height: 2rem;
    font-size: 16px;
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    margin-left: 5%;
  }
  .upLoad {
    margin: 0 auto;
    width: 88%;
    height: 6.8rem;
    // background-color: yellow;
    border: 2px dashed #4da1ff;
    border-radius: 10px;
    position: relative;
    .upLoad_content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      height: 100px;
      margin: auto;
      img {
        height: 30px;
        margin-top: 5%;
        margin-bottom: 3%;
      }
      div {
        color: #62acfe;
        font-size: 15px;
        // font-family: PingFang_Bold;
        font-weight: 600;
      }
    }
  }

  .content-padded {
    margin: 0;
  }
  .row {
    margin-left: 0%;
  }
}
</style>
