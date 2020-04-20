<template>
  <div class="personal-center">
    <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账户信息</header-title>
    </page-header>
    <page-content>
      <div class="content-padded">
        <div class="row img_content">
          <div class="col-100">
            <div class="user-card">
              <div class="card-content">
                <div class="left-img">
                  <img :src="rabbit" alt="" />
                </div>
                <div class="right-content">
                  <h4>
                    <span>{{user | dealUser}}</span>
                    <router-link :to="{ path: 'personmsg' }">
                 
                    </router-link>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-100" style="margin-left: 2%;">

            <div class="user-card-bg">
              <div class="kr-top">
                <span class="kr-span-left">000000111111</span>
                <span class="kr-span-right">银行代扣</span>
              </div>
              <div class="kr-middle">
                9988 **** **** 0098
              </div>
              <div class="kr-buttom">
                <div class="kr-div-left kr-div">
                  <div class="kr-div-spanT">
                    <span>000000011111</span>
                  </div>
                  <div class="kr-div-spanB">
                    <span>深圳市罗湖区沿河北路宁花花园3034号</span>
                  </div>
                </div>
                <div class="kr-div-right kr-div">
                  <div class="kr-div-spanT">
                    <span>000000011111</span>
                  </div>
                  <div class="kr-div-spanB">
                    <span>深圳市罗湖区沿河北路宁花花园3034号</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="user-card-bg">
              <div class="kr-top">
                <span class="kr-span-left">000000111111</span>
                <span class="kr-span-right">银行代扣</span>
              </div>
              <div class="kr-middle">
                9988 **** **** 0098
              </div>
              <div class="kr-buttom">
                <div class="kr-div-left kr-div">
                  <div class="kr-div-spanT">
                    <span>000000011111</span>
                  </div>
                  <div class="kr-div-spanB">
                    <span>深圳市罗湖区沿河北路宁花花园3034号</span>
                  </div>
                </div>
                <div class="kr-div-right kr-div">
                  <div class="kr-div-spanT">
                    <span>000000011111</span>
                  </div>
                  <div class="kr-div-spanB">
                    <span>深圳市罗湖区沿河北路宁花花园3034号</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="row content-bottom">
          <span>说明：拖动水表，可以更换账户</span>
          <m-button size="middle">保存</m-button>
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: "小胖子",
      // header: require('@/project/assets/img/header.png'),
      // rabbit: require('@/project/assets/img/rabbit.jpg'),
      list: [
        {
          title: '用户编号',
          content: '张三（10011110001）'
        },
        {
          title: '用户地址',
          content: '步埠路四级39号'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        },
        {
          name: '充值'
        },
        {
          name: '缴费'
        }
      ]
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 3)
        return value.slice(0, 3) + '...'
      else
        return value
    }
  },
  components: {

  },
  methods: {
    log(m) {
      console.log(m || 'log')
    }
  }
}
</script>

<style scoped lang="less">
.personal-center {
  .user_msg {
    font-family: PingFang_Medium;
  }
  .img_content {
    height: 10rem;
    width: 100%;
    background: url('../../../../../static/img/juxing.png') no-repeat;
    background-size: 100% 100%;
  }
  .content-padded {
    margin: 0;
    background: #efefef;
  }
  .row {
    margin-left: 0%;
  }
  .content-bottom{
    text-align: center;
    padding: 10px 20%;
    span{
      font-size: 15px;
      font-family: PingFang_Bold;
      color:#ed702d;
      display: inline-block;
      padding: 10px;
    }
  }
  .col-100 {
    // padding: 0 .5rem;
    .user-card {
      border-radius: 10px;
      padding: 27% 0 0 0;
      background-size: 100%;
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
      }
      .card-header {
        .img {
          float: left;
        }
        a {
          float: right;
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        .left-img {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          padding: 0.25rem 0;
          width: 25%;
          img {
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
          }
        }
        .right-content {
          margin-left: 0.75rem;
          width: 100%;
          position: relative;
          padding: 0.9rem 0.75rem 0.4rem 0;
          color: #fff;
          h4,
          span {
            margin: 10px 0;
            font-size: 24px;
          }
          h4 {
            a {
              color: #fff;
              float: right;
              font-size: 15px;
              line-height: 27px;
              font-family: PingFang_Regular;
              font-weight: 500;
            }
          }
          p {
            font-size: 16px;
            span {
              padding-left: 20px;
              background: url("../../../../../static/img/coin.png") no-repeat;
              background-position: left bottom;
              background-size: 14px;
            }
          }
        }
      }
    }
    .grids-small {
      .grid {
        border: none;
        .grid-icon {
          border: 1px solid red;
        }
      }
    }
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
    .user-card-bg {
      background-size: 102%;
      box-shadow: 1px 1px 5px 1px #888888;
      margin-top: .5rem;
      margin-bottom: .5rem;
      background: #fff;
      .kr-top{
        font-size: 15px;
        font-family: PingFang_Medium;
        padding:10px;
        span{
          display: inline-block;
        }
        .kr-span-left{

        }
        .kr-span-right{
          float: right;
          color:#ed702d;
        }
      }
      .kr-middle{
        padding: 0 10px 10px 10px;
        font-size: 16px;
        font-family: PingFang_Medium;
      }
      .kr-buttom{
        border: 1px solid #ececec;
        padding: 3%;
        width: 100%;
        display: flex;
        .kr-div{
          padding: 6px;
          box-shadow: 1px 1px 5px 1px #888888;
          width: 48%;
          border-radius: 10px;
          div{
            padding: 6px;
            font-size: 15px;
            font-family: PingFang_Medium;
          }
          .kr-div-spanT{
            text-align: center;
            color: #489eff;
            border-bottom: 1px solid #ececec;
          }
          .kr-div-spanB{

          }
        }
        .kr-div-left{
          
        }
        .kr-div-right{
          margin-left: 4%;
        }
      }
    }
  }
}
</style>