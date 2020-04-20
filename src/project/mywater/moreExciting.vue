<template>
  <div class="business-hand">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link><icon icon="back"></icon>返回</header-link>
      <header-title>业务办理</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="yh-body">
          <div class="yh-conent">
            <div @click="goChild('peopleApply')" class="yh-div01">
              <img src="../../../static/img/renwu(b).png" alt="">
            </div>
            <div @click="goChild('peopleApply')" class="yh-div02">
              <div class="yh-title">水管家</div>
              <div class="yh-remark">管理您的用水</div>
            </div>
          </div>
          <!-- <div class="yh-conent">
            <div @click="goChild('compApply')" class="yh-div01">
              <img src="../../../static/img/qiye(a).png" alt="">
            </div>
            <div @click="goChild('compApply')" class="yh-div02">
              <div class="yh-title">企业用水申请</div>
              <div class="yh-remark">企业客户用水报装</div>
            </div>
          </div>
          <div class="yh-conent">
            <div @click="goProgressQuery()" class="yh-div01">
              <img src="../../../static/img/chaxun(c).png" alt="">
            </div>
            <div @click="goProgressQuery()" class="yh-div02">
              <div class="yh-title">进度查询</div>
              <div class="yh-remark">查询业务办理进度</div>
            </div>
          </div> -->
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
  data() {
    return {
      message:{
        title:"更多精彩",
        span1:"更多精彩，敬请期待！",
        span2:"",
        isShow: '',
      },
      title: '更多精彩',
    }
  },

  methods: {
    goChild(path) {
      return
      var content = {}
      content.isModify = 2// 自定义数字2，用水申请页面添加
      if (path == 'peopleApply') {
        this.$router.push({ path: '/peopleApply', query: content })
      } else if (path == 'compApply') {
        this.$router.push({ path: '/compApply', query: content })
      }
    },
    goProgressQuery() {
      this.$router.push({ path: '/progressQuery' })
    }
  }
}
</script>

<style scoped lang="less">
.business-hand {
  .grids:before {
    border: none;
  }
  .content-padded {
    margin: 0 !important;
    height:100%;
  }
  .col-100 {
    .grid-demo {
      .grids {
        // display: flex;
        .grid {
          // flex: 0.8;
          width: 30%;
          margin-left: 2.5%;
          margin-top: 3%;
          margin-bottom: 3%;
          box-shadow: 1px 1px 5px 1px #888888;
          padding: 10px;
          .grid_label {
            // font-family: PingFang_Bold;
            font-weight: 600;
            font-size: 12px;
          }
        }
      }
    }
  }
  .yh-body{
    height: 70%;
    padding: 5% 8%;
    .yh-conent{
      height: 20%;
      width: 100%;
      display: flex;
      flex-direction: row;
      box-shadow: 1px 1px 5px 1px #888888;
      margin-top:5%;
      border-radius: 5px;
      .yh-div01{
        width:25%;
        background: #ebf3ff;
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
        width: 75%;
        line-height:100%;
        height: 100%;
        padding:2% 0% 2% 8%;
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
        }
        .yh-remark{
          font-size:16px;
          font-weight: 100;
        }
      }
    }
  }
}
</style>
