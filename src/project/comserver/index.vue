<template>
  <page-content>
    <div class="water-price-and-report">
      <!-- <myHeader :title="title"></myHeader> -->
      <headerThree :message = 'message'></headerThree>
      <div class="yh-body">
        <div class="yh-conent">
          <div @click="goChild('waterPriceInfo')" class="yh-div01">
            <img src="../../../static/img/shuijiaxinxi(2).png" alt="">
          </div>
          <div @click="goChild('waterPriceInfo')" class="yh-div02">
            <div class="yh-title">水价信息</div>
            <div class="yh-remark">用水收费标准</div>
          </div>
        </div>
        <div class="yh-conent">
          <div @click="goChild('qualityReport')" class="yh-div01">
            <img src="../../../static/img/shuizhi(3).png" alt="">
          </div>
          <div @click="goChild('qualityReport')" class="yh-div02">
            <div class="yh-title">水质报告</div>
            <div class="yh-remark">水质监测报告</div>
          </div>
        </div>
      </div>
    </div>

  </page-content>
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
        title:"水价信息",
        span1:"足不出户",
        span2:"在家看水价信息",
        isShow: '',
      },
      fastpay: require('../../../static/img/banner-pic.png'),
      comp: require('@/project/assets/images/form/i-form-name.png'),
      notePic: require('@/project/assets/images/home/modal.png'),
      waterprice: require('../../../static/img/shuijia.png'),
      title: "水价信息",
      tabIndex: 0,
    }
  },
  mounted() {

  },
  methods: {
    goChild(path) {
      if (path == 'waterPriceInfo') {
        this.$router.push({ path: '/waterPriceInfo' })
      } else if (path == 'qualityReport') {
        this.$router.push({ path: '/qualityReport' })
      }
    },
  }
}

</script>

<style scoped lang="less">
.water-price-and-report {
  height: 100%;
  .yh-body {
    height: 70%;
    padding: 5% 8%;
    // display: flex;
    // flex-direction:column;
    // justify-content: center;
    // align-items: center;
    .yh-conent {
      height: 20%;
      width: 100%;
      display: flex;
      flex-direction: row;
      box-shadow: 1px 1px 5px 1px #888888;
      margin-top: 5%;
      border-radius: 5px;
      .yh-div01 {
        width: 25%;
        background: #12377e;
        // display: table-cell;
        // vertical-align: middle;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // margin:0 auto;
        img {
          width: 35%;
          color: #fff;
          // margin: 0 auto;
        }
      }
      .yh-div02 {
        width: 75%;
        line-height: 100%;
        height: 100%;
        padding: 2% 0% 2% 8%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // div{
        //   padding:4% 0 0 10%;
        // }
        .yh-title {
          // font-weight: 600;
          font-weight: bolder;
          font-size: 16px;
        }
        .yh-remark {
          font-size: 16px;
          font-weight: 100;
        }
      }
    }
  }
}
</style>