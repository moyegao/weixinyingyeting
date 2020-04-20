 <template>
  <div class="water-query">
    <page-content>
      <div class="content-padded">
        <headerThree :message='message'></headerThree>
        <div class="kr-body" v-if="waterConcernsDataShow">
          <van-cell center v-for="(item,i) in waterConcernsData" :key="item.groupCode" :title="item.groupArea">
            <template #right-icon>
              <van-switch v-model="checkList[i]" size="24" @click="checkChange(item, i)" />
            </template>
          </van-cell>
        </div>

      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import { Toast } from 'vant';
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      // 水司关注数据
      waterConcernsData: [],
      // 状态数组（关注：未关注）
      checkList: [],
      waterConcernsDataShow: false,

      checked: false,
      message: {
        title: "关注地区",
        span1: "尊敬的" + (localStorage.getItem('nickname') === null ? 'XX' : localStorage.getItem('nickname')),
        span2: "关注地区后可接收停水通知或其它重要公告信息",
        isShow: '',
      },
      isShow: 1,
      title: "关注地区",
    }
  },
  mounted() {
    this.getWaterConcernsData()
  },
  methods: {
    // 获取关注水司列表
    getWaterConcernsData() {
      var _this = this;
      this.waterConcernsDataShow = false
      let params = {
        "data": {
          "openId": localStorage.getItem('openId'),
        },
      }
      this.$api.fetch({
        params: params,
        apiUrl: '/myWater/compLinkList',
      }).then(res => {
        this.waterConcernsDataShow = true
        _this.waterConcernsData = res
        // 获取已关注和未关注的键值
        for (let i = 0; i < res.length; i++) {
          if (res[i].isLink == 1) {
            _this.checkList.push(true)
          }else{
            _this.checkList.push(false)
          }
          
        }
      })
    },
    // 修改状态
    checkChange(item, index){
      // checkList的状态比当前状态慢一步，下面代码使状态与页面显示效果同步
      this.checkList[index] = !this.checkList[index]

      var _this = this;
      let params = {
        "data": {
          "groupCode": item.groupCode,
          "openId": localStorage.getItem('openId'),
        },
      }
      // 关注多传以下字段
      if (this.checkList[index]) {
        params.data.groupName = item.groupName
        params.data.groupArea = item.groupArea
      }
      this.$api.fetch({
        params: params,
        apiUrl: _this.checkList[index]?'/myWater/compLink':'/myWater/compUnLink',// true:关注  false:取消关注
      }).then(res => {
        
      }).catch(err => {
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
    },
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
.water-query {
  .content-padded {
    height: 100%;
    margin: 0;
    .kr-body {
      padding: 5% 5%;
      height: 70%;
      // margin-top:10%;
      .kr-containt {
        box-shadow: 0px 1px 9px -1px #888;
        border-radius: 10px 10px 0px 0px;
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