 <template>
  <div class="leakUpload">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>上传附件</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="row">
          <div class="upLoad_title" v-if="upLoadNeedData.type == 'repair'">报修相关图片<span style="color: red">*</span></div>
          <div class="upLoad_title" v-if="upLoadNeedData.type == 'leak'">报漏相关图片<span style="color: red">*</span></div>
          <van-uploader v-model="fileList" multiple :max-count="3" :after-read="afterRead1" />
        </div>
        <div class="btn_box">
          <a @click="submit">
            <m-button size="large">提交</m-button>
          </a>
          <a @click="goBack">
            <m-button size="large" style="float: left;margin-left: 12%">上一步</m-button>
          </a>
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader,headerThree
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
      title: '上传附件',
      fileList: [],
    }
  },

  mounted() {
    console.log(this.upLoadNeedData);
    // if (this.upLoadNeedData.isModify != 2) {
    //   this.fileList.push({ url: this.upLoadNeedData.fileList[0] })
    //   this.fileList2.push({ url: this.upLoadNeedData.fileList[1] })
    //   this.fileList3.push({ url: this.upLoadNeedData.fileList[2] })
    // }
  },
  methods: {
    afterRead1(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
    },
    // 返回按钮
    goBack() {
      // if (this.upLoadNeedData.type == 'repair') {
      //   this.$parent.peopleApplyShow = true
      // } else {
      //   this.$parent.compApplyShow = true
      // }

      this.$parent.leakandrepairsShow = true
      if (this.upLoadNeedData.type == 'repair') {
        this.$parent.tabIndex = 0
      } else if (this.upLoadNeedData.type == 'leak') {
        this.$parent.tabIndex = 1
      }

    },
    // 返回按钮
    submit() {
      var item = [];
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          item.push(this.fileList[0].content.split(",")[1]) // base64转码
        }

      }

      // 主页面接收到数据后在主页面控制上传图片页面关闭
      if (this.upLoadNeedData.type == 'repair') {
        this.BUS.$emit('fileList', item, 'repair')
      } else {
        this.BUS.$emit('fileList', item, 'leak')
      }
    },
  },
}
</script>

<style scoped lang="less">
.leakUpload {
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
