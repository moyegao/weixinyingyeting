 <template>
  <div class="water-query">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>共享抄表</header-title>
    </page-header> -->
    
    <page-content>
      <div class="content-padded">
        <myHeader :title="title"></myHeader>
        <div class="kr-body">
          <div class="kr-containt">
            <div class="kr-top">
              <h4>广东省深圳市罗湖区太宁路85号科技大厦408号</h4>
            </div>
            <div class="kr-middle">
              <div class="kr-div">
                <p class="kr-p">楼栋</p>  
                <p>楼栋1</p>
              </div>
              <div class="kr-div">
                <p class="kr-p">表数量</p>
                <p>3320</p>
              </div>
              <div class="kr-div">
                <p class="kr-p">单价</p>
                <p>0.6</p>
              </div>
            </div>
            <div class="kr-buttom">
              <router-link :to="{ path: 'recharge' }"> 
                <m-button size="big" type="danger">
                  抢单
                </m-button>
              </router-link> 
            </div>
          </div>
          <div class="kr-containt">
            <div class="kr-top">
              <h4>广东省深圳市罗湖区太宁路85号科技大厦408号</h4>
            </div>
            <div class="kr-middle">
              <div class="kr-div">
                <p class="kr-p">楼栋</p>  
                <p>楼栋1</p>
              </div>
              <div class="kr-div">
                <p class="kr-p">表数量</p>
                <p>3320</p>
              </div>
              <div class="kr-div">
                <p class="kr-p">单价</p>
                <p>0.6</p>
              </div>
            </div>
            <div class="kr-buttom">
              <router-link :to="{ path: 'MeterReading' }">
                <m-button size="big"  type="success">
                  抄表
                </m-button>
              </router-link>
            </div>
          </div>
        </div>
        
      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
export default {
  components: {
    myHeader
  },
  data() {
    return {
      title: '共享抄表',
      user: "小胖子",
      // header: require('@/project/assets/img/header.png'),
      // rabbit: require('@/project/assets/img/rabbit.jpg'),
    }
  },
  mounted() {

  },
  methods: {

  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.water-query {
  .content-padded{
    margin: 0;
    .kr-body{
      padding:0 10px;
      .kr-containt{
        margin-top:18px;
        box-shadow: 1px 1px 5px 1px #888;
        .kr-top{
          padding: 16px 10px;
          h4{
            // font-family: PingFang_Bold;
            font-weight: 600;
            font-size:15px;
            text-align: center;
          }
        }
        .kr-middle{
          display: flex;
          width: 100%;
          .kr-div{
            width: 33.3%;
            height: 60px;
            padding: 10px 10px;
            text-align: center;
            border: 1px solid #e6e6e6;
            p{
              // font-family: PingFang_Bold;
              font-weight: 600;
              font-size:15px;
            }
            .kr-p{
              color:#ccc;
              // font-family: PingFang_Regular;
              font-weight: 300;
              font-size:13px;
            }
          }
        }
        .kr-buttom{
          
          .button{
            height: 40px;
            line-height: 40px;
            border-radius: 0;
            // font-family:PingFang_Regular ;
            font-size: 16px;
          }
          .button-danger {
            background: #FF4D4D;
          }
          .button-success {
            background: #49cc7c;
          }
        }
      }
    }   
  }
  .row{
    margin-left: 0;
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
      a {
        font-size: 24px;
        color: #fff;
        background: #3193f6;
        height: 40px;
        width: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
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

  table {
    th {
      background: #51a5e8;
      color: #fff;
      padding: 0.2rem;
    }
    td {
      text-align: center;
      border-bottom: 1px solid #00b4c2;
      padding: 0.2rem;
    }
  }
}
</style>
